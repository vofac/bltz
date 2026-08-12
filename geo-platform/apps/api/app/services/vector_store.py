import uuid
from functools import lru_cache

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, FieldCondition, Filter, MatchValue, PointStruct, VectorParams

from app.core.config import get_settings

COLLECTION_NAME = "geo_documents"


@lru_cache
def get_client() -> QdrantClient:
    """VECTOR_DB_URL 支持两种形态：真实 Qdrant 服务的 http(s) URL（docker-compose 部署使用），
    或 ':memory:' / 本地路径（用于测试与无 Qdrant 服务时的轻量本地开发）。"""
    url = get_settings().VECTOR_DB_URL
    if url.startswith("http://") or url.startswith("https://"):
        return QdrantClient(url=url)
    return QdrantClient(location=url)


def ensure_collection(client: QdrantClient, dimension: int) -> None:
    if not client.collection_exists(COLLECTION_NAME):
        client.create_collection(
            COLLECTION_NAME,
            vectors_config=VectorParams(size=dimension, distance=Distance.COSINE),
        )


def upsert_chunks(
    client: QdrantClient,
    dimension: int,
    company_id: uuid.UUID,
    document_id: uuid.UUID,
    chunks: list[str],
    vectors: list[list[float]],
) -> list[str]:
    ensure_collection(client, dimension)
    point_ids = [str(uuid.uuid4()) for _ in chunks]
    points = [
        PointStruct(
            id=point_id,
            vector=vector,
            payload={
                "company_id": str(company_id),
                "document_id": str(document_id),
                "chunk_text": chunk,
            },
        )
        for point_id, chunk, vector in zip(point_ids, chunks, vectors, strict=True)
    ]
    client.upsert(collection_name=COLLECTION_NAME, points=points)
    return point_ids


def delete_points(client: QdrantClient, point_ids: list[str]) -> None:
    if point_ids:
        client.delete(collection_name=COLLECTION_NAME, points_selector=point_ids)


def search(
    client: QdrantClient, company_id: uuid.UUID, query_vector: list[float], limit: int = 5
) -> list[dict]:
    if not client.collection_exists(COLLECTION_NAME):
        return []
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        query_filter=Filter(
            must=[FieldCondition(key="company_id", match=MatchValue(value=str(company_id)))]
        ),
        limit=limit,
    ).points
    return [
        {
            "chunk_text": point.payload.get("chunk_text", ""),
            "document_id": point.payload.get("document_id"),
            "score": point.score,
        }
        for point in results
    ]
