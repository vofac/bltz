"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  ComparisonResult,
  Competitor,
  createCompetitor,
  deleteCompetitor,
  getComparison,
  listCompetitors,
} from "@/lib/competitors";

export default function CompetitorsPage() {
  const router = useRouter();
  const [competitors, setCompetitors] = useState<Competitor[] | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [competitorList, comparisonResult] = await Promise.all([
      listCompetitors(),
      getComparison(),
    ]);
    setCompetitors(competitorList);
    setComparison(comparisonResult);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    refresh().catch((err) => setError(err instanceof ApiError ? err.message : "加载失败"));
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createCompetitor(name.trim());
      setName("");
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "添加失败");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteCompetitor(id);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "删除失败");
    }
  }

  return (
    <AppShell>
      <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
        竞品分析
      </span>
      <h1 className="mt-1 text-2xl font-semibold">竞争品牌对比</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-500">
        添加竞争品牌后，系统会统计它们在关键词监测中被 AI 引擎提及的频率，与你的品牌对比。
      </p>

      <form onSubmit={handleCreate} className="mt-6 flex gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：三棵树"
          className="max-w-sm"
        />
        <Button type="submit" disabled={creating}>
          {creating ? "添加中..." : "添加竞品"}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {competitors && competitors.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {competitors.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-sm dark:border-neutral-800"
            >
              {c.name}
              <button
                onClick={() => handleDelete(c.id)}
                className="text-neutral-400 hover:text-red-600"
                aria-label={`删除 ${c.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {comparison && (
        <Card className="mt-8">
          <h2 className="text-sm font-semibold">对比分析</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
                  <th className="pb-2 font-normal">品牌</th>
                  <th className="pb-2 font-normal">GEO 指数</th>
                  <th className="pb-2 font-normal">AI 提及次数</th>
                  <th className="pb-2 font-normal">提及率</th>
                </tr>
              </thead>
              <tbody>
                {comparison.entries.map((entry) => (
                  <tr
                    key={entry.name}
                    className="border-b border-neutral-100 last:border-0 dark:border-neutral-900"
                  >
                    <td className="py-2 font-medium">
                      {entry.name}
                      {entry.is_own_brand && (
                        <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 font-mono text-[10px] text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                          我的品牌
                        </span>
                      )}
                    </td>
                    <td className="py-2 font-mono tabular-nums">
                      {entry.geo_score ?? "—"}
                    </td>
                    <td className="py-2 font-mono tabular-nums">{entry.mention_count}</td>
                    <td className="py-2 font-mono tabular-nums">
                      {entry.mention_rate !== null
                        ? `${Math.round(entry.mention_rate * 100)}%`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {comparison.opportunities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold">机会点</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {comparison.opportunities.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="text-brand-500">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </AppShell>
  );
}
