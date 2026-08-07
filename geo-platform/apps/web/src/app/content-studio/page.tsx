"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  Content,
  ContentListItem,
  deleteContent,
  generateContent,
  getContent,
  listContents,
  publishContent,
} from "@/lib/contents";

export default function ContentStudioPage() {
  const router = useRouter();
  const [contents, setContents] = useState<ContentListItem[] | null>(null);
  const [selected, setSelected] = useState<Content | null>(null);
  const [keyword, setKeyword] = useState("");
  const [generating, setGenerating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    listContents()
      .then(setContents)
      .catch((err) => setError(err instanceof ApiError ? err.message : "加载失败"));
  }, [router]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const content = await generateContent(keyword.trim());
      setSelected(content);
      setContents((prev) => [
        { id: content.id, title: content.title, status: content.status, created_at: content.created_at },
        ...(prev ?? []),
      ]);
      setKeyword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "生成失败");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSelect(id: string) {
    setError(null);
    try {
      setSelected(await getContent(id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "加载内容失败");
    }
  }

  async function handlePublish() {
    if (!selected) return;
    setBusy(true);
    try {
      const updated = await publishContent(selected.id);
      setSelected(updated);
      setContents(
        (prev) => prev?.map((c) => (c.id === updated.id ? { ...c, status: updated.status } : c)) ?? null
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "发布失败");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setBusy(true);
    try {
      await deleteContent(selected.id);
      setContents((prev) => prev?.filter((c) => c.id !== selected.id) ?? null);
      setSelected(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "删除失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
        内容优化助手
      </span>
      <h1 className="mt-1 text-2xl font-semibold">AI GEO 内容生成</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-500">
        输入一个关键词，自动生成符合 E-E-A-T 原则的标题、摘要、正文、FAQ 与 Schema JSON-LD 结构化数据。
      </p>

      <form onSubmit={handleGenerate} className="mt-6 flex gap-3">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="例如：环保涂料厂家"
          className="max-w-sm"
        />
        <Button type="submit" disabled={generating}>
          {generating ? "生成中..." : "生成内容"}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="text-sm font-semibold">历史内容</h2>
          <div className="mt-3 flex flex-col gap-2">
            {contents?.length === 0 && (
              <p className="text-sm text-neutral-500">还没有生成过内容</p>
            )}
            {contents?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  selected?.id === item.id
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900"
                    : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                }`}
              >
                <span className="line-clamp-1">{item.title}</span>
                <Badge tone={item.status === "published" ? "success" : "neutral"}>
                  {item.status === "published" ? "已发布" : "草稿"}
                </Badge>
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2">
          {!selected && (
            <Card>
              <p className="text-sm text-neutral-500">生成一篇内容，或从左侧历史记录中选择一篇查看。</p>
            </Card>
          )}

          {selected && (
            <Card className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{selected.title}</h2>
                  <Badge
                    tone={selected.status === "published" ? "success" : "neutral"}
                    className="mt-2"
                  >
                    {selected.status === "published" ? "已发布" : "草稿"}
                  </Badge>
                </div>
                <div className="flex shrink-0 gap-2">
                  {selected.status === "draft" && (
                    <Button onClick={handlePublish} disabled={busy}>
                      发布
                    </Button>
                  )}
                  <Button variant="ghost" onClick={handleDelete} disabled={busy}>
                    删除
                  </Button>
                </div>
              </div>

              {selected.summary && (
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{selected.summary}</p>
              )}

              {selected.body && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wide text-neutral-500">正文</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
                    {selected.body}
                  </p>
                </div>
              )}

              {selected.faq && selected.faq.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wide text-neutral-500">FAQ</h3>
                  <div className="mt-2 flex flex-col gap-3">
                    {selected.faq.map((item) => (
                      <div key={item.question}>
                        <p className="text-sm font-medium">{item.question}</p>
                        <p className="mt-1 text-sm text-neutral-500">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.schema_jsonld && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wide text-neutral-500">
                    Schema JSON-LD
                  </h3>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-50 p-4 font-mono text-xs text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">
                    {JSON.stringify(selected.schema_jsonld, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
