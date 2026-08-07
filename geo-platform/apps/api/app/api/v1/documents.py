import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.models.document import Document
from app.models.embedding import Embedding
from app.models.user import User
from app.schemas.document import (
    DocumentListItem,
    DocumentOut,
    SearchRequest,
    SearchResponse,
    SearchResultItem,
)
from app.services.chunking import chunk_text
from app.services.embeddings.factory import get_embedding_provider
from app.services.text_extraction import SUPPORTED_EXTENSIONS, UnsupportedFileTypeError, extract_text
from app.services.vector_store import delete_points, get_client, search as vector_search, upsert_chunks

router = APIRouter(prefix="/documents", tags=["documents"])


def _require_company(current_user: User) -> None:
    if not current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="当前账户未关联企业")


def _get_owned_document(db: Session, document_id: uuid.UUID, current_user: User) -> Document:
    document = db.get(Document, document_id)
    if not document or document.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文档不存在")
    return document


def _to_document_out(db: Session, document: Document) -> DocumentOut:
    chunk_count = db.query(Embedding).filter(Embedding.document_id == document.id).count()
    return DocumentOut(
        id=document.id,
        filename=document.filename,
        file_type=document.file_type,
        extracted_text=document.extracted_text,
        chunk_count=chunk_count,
        created_at=document.created_at,
    )


@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentOut:
    _require_company(current_user)
    settings = get_settings()

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"文件超过 {settings.MAX_UPLOAD_SIZE_MB}MB 限制",
        )

    try:
        extracted = extract_text(file.filename, content)
    except UnsupportedFileTypeError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    ext = "." + file.filename.rsplit(".", 1)[-1].lower()
    company_dir = Path(settings.STORAGE_DIR) / str(current_user.company_id)
    company_dir.mkdir(parents=True, exist_ok=True)
    storage_path = company_dir / f"{uuid.uuid4()}{ext}"
    storage_path.write_bytes(content)

    document = Document(
        company_id=current_user.company_id,
        filename=file.filename,
        file_type=ext.lstrip("."),
        storage_path=str(storage_path),
        extracted_text=extracted,
    )
    db.add(document)
    db.flush()

    chunks = chunk_text(extracted)
    if chunks:
        provider = get_embedding_provider()
        vectors = provider.embed(chunks)
        client = get_client()
        point_ids = upsert_chunks(
            client, provider.dimension, current_user.company_id, document.id, chunks, vectors
        )
        for chunk, point_id in zip(chunks, point_ids, strict=True):
            db.add(
                Embedding(document_id=document.id, chunk_text=chunk, vector_point_id=point_id)
            )

    db.commit()
    db.refresh(document)
    return _to_document_out(db, document)


@router.get("", response_model=list[DocumentListItem])
def list_documents(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> list[Document]:
    _require_company(current_user)
    return (
        db.query(Document)
        .filter(Document.company_id == current_user.company_id)
        .order_by(Document.created_at.desc())
        .all()
    )


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(
    document_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentOut:
    _require_company(current_user)
    document = _get_owned_document(db, document_id, current_user)
    return _to_document_out(db, document)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    _require_company(current_user)
    document = _get_owned_document(db, document_id, current_user)

    embeddings = db.query(Embedding).filter(Embedding.document_id == document.id).all()
    if embeddings:
        delete_points(get_client(), [e.vector_point_id for e in embeddings])

    storage_file = Path(document.storage_path)
    if storage_file.exists():
        storage_file.unlink()

    db.delete(document)
    db.commit()


@router.post("/search", response_model=SearchResponse)
def search_documents(
    payload: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SearchResponse:
    """Phase 1 使用 MockEmbeddingProvider，检索结果不具备真实语义相似度，
    仅用于验证『向量化 -> 存储 -> 检索』链路的正确性；Phase 2 切换真实
    embedding 模型后，检索质量会随之变为真实的语义相似度匹配。"""
    _require_company(current_user)
    provider = get_embedding_provider()
    query_vector = provider.embed([payload.query])[0]

    raw_results = vector_search(
        get_client(), current_user.company_id, query_vector, limit=payload.limit
    )

    results: list[SearchResultItem] = []
    for item in raw_results:
        document = db.get(Document, uuid.UUID(item["document_id"]))
        if not document:
            continue
        results.append(
            SearchResultItem(
                document_id=document.id,
                filename=document.filename,
                chunk_text=item["chunk_text"],
                score=item["score"],
            )
        )
    return SearchResponse(results=results)
