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
  AI_MODEL_LABELS,
  AITask,
  Keyword,
  createKeyword,
  listKeywords,
  monitorKeyword,
} from "@/lib/keywords";

export default function KeywordsPage() {
  const router = useRouter();
  const [keywords, setKeywords] = useState<Keyword[] | null>(null);
  const [newText, setNewText] = useState("");
  const [creating, setCreating] = useState(false);
  const [monitoringId, setMonitoringId] = useState<string | null>(null);
  const [tasksByKeyword, setTasksByKeyword] = useState<Record<string, AITask[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    listKeywords()
      .then(setKeywords)
      .catch((err) => setError(err instanceof ApiError ? err.message : "加载失败"));
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const created = await createKeyword(newText.trim());
      setKeywords((prev) => [created, ...(prev ?? [])]);
      setNewText("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "创建关键词失败");
    } finally {
      setCreating(false);
    }
  }

  async function handleMonitor(keywordId: string) {
    setMonitoringId(keywordId);
    setError(null);
    try {
      const tasks = await monitorKeyword(keywordId);
      setTasksByKeyword((prev) => ({ ...prev, [keywordId]: tasks }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "监测失败");
    } finally {
      setMonitoringId(null);
    }
  }

  return (
    <AppShell>
      <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
        AI 搜索监测
      </span>
      <h1 className="mt-1 text-2xl font-semibold">关键词监测</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-500">
        添加关键词后点击「开始监测」，系统会并行调用 ChatGPT / Claude / Gemini / Perplexity /
        Google AI Overview，检测你的品牌是否被提及、排在第几位、引用了哪些来源。
      </p>

      <form onSubmit={handleCreate} className="mt-6 flex gap-3">
        <Input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="例如：艺术漆十大品牌"
          className="max-w-sm"
        />
        <Button type="submit" disabled={creating}>
          {creating ? "添加中..." : "添加关键词"}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex flex-col gap-4">
        {keywords === null && <p className="text-sm text-neutral-500">加载中...</p>}
        {keywords?.length === 0 && (
          <p className="text-sm text-neutral-500">还没有关键词，先添加一个开始监测吧。</p>
        )}

        {keywords?.map((keyword) => {
          const tasks = tasksByKeyword[keyword.id];
          const mentionedCount = tasks?.filter((t) => t.result?.brand_mentioned).length ?? 0;

          return (
            <Card key={keyword.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium">{keyword.text}</h2>
                  {tasks && (
                    <p className="mt-1 text-xs text-neutral-500">
                      {mentionedCount} / {tasks.length} 个 AI 引擎提及了你的品牌
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  disabled={monitoringId === keyword.id}
                  onClick={() => handleMonitor(keyword.id)}
                >
                  {monitoringId === keyword.id ? "监测中..." : "开始监测"}
                </Button>
              </div>

              {tasks && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {AI_MODEL_LABELS[task.ai_model]}
                        </span>
                        <Badge tone={task.result?.brand_mentioned ? "success" : "neutral"}>
                          {task.result?.brand_mentioned
                            ? `第 ${task.result.mention_position} 位提及`
                            : "未提及"}
                        </Badge>
                      </div>
                      <p className="mt-2 line-clamp-3 text-xs text-neutral-500">
                        {task.result?.raw_answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
