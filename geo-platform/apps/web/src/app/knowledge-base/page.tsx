"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  DocumentListItem,
  SearchResultItem,
  deleteDocument,
  listDocuments,
  searchDocuments,
  uploadDocument,
} from "@/lib/documents";

export default function KnowledgeBasePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentListItem[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    listDocuments()
      .then(setDocuments)
      .catch((err) => setError(err instanceof ApiError ? err.message : "加载失败"));
  }, [router]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const doc = await uploadDocument(file);
      setDocuments((prev) => [
        { id: doc.id, filename: doc.filename, file_type: doc.file_type, created_at: doc.created_at },
        ...(prev ?? []),
      ]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "上传失败");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev?.filter((d) => d.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "删除失败");
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      setResults(await searchDocuments(query.trim()));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "检索失败");
    } finally {
      setSearching(false);
    }
  }

  return (
    <AppShell>
      <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
        企业知识库
      </span>
      <h1 className="mt-1 text-2xl font-semibold">文档知识库</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-500">
        上传 PDF / Word / Excel / 图片，系统会自动提取文本（图片走 OCR）并向量化存入知识库，供检索与内容生成引用。
      </p>

      <div className="mt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.xls,.png,.jpg,.jpeg,.txt"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "上传处理中..." : "上传文档"}
          </Button>
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold">已上传文档</h2>
          <div className="mt-3 flex flex-col gap-2">
            {documents?.length === 0 && (
              <p className="text-sm text-neutral-500">还没有上传任何文档</p>
            )}
            {documents?.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2">
                  <Badge>{doc.file_type.toUpperCase()}</Badge>
                  <span className="text-sm">{doc.filename}</span>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-neutral-400 hover:text-red-600"
                  aria-label={`删除 ${doc.filename}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold">知识检索</h2>
          <p className="mt-1 text-xs text-neutral-400">
            Phase 1 使用模拟向量模型，检索结果不代表真实语义相似度，仅用于验证检索链路。
          </p>
          <form onSubmit={handleSearch} className="mt-3 flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入检索内容..."
            />
            <Button type="submit" disabled={searching}>
              {searching ? "检索中..." : "检索"}
            </Button>
          </form>

          {results && (
            <div className="mt-4 flex flex-col gap-3">
              {results.length === 0 && (
                <p className="text-sm text-neutral-500">未找到相关内容</p>
              )}
              {results.map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.filename}</span>
                    <span className="font-mono text-xs text-neutral-400">
                      score {r.score.toFixed(3)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-neutral-500">{r.chunk_text}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
