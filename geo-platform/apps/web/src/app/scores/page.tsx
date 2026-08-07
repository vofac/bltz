"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreBar } from "@/components/score-bar";
import { ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Score, computeScore, getLatestScore } from "@/lib/scores";

export default function ScoresPage() {
  const router = useRouter();
  const [score, setScore] = useState<Score | null | undefined>(undefined);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    getLatestScore()
      .then(setScore)
      .catch((err) => setError(err instanceof ApiError ? err.message : "加载失败"));
  }, [router]);

  async function handleCompute() {
    setComputing(true);
    setError(null);
    try {
      const result = await computeScore();
      setScore(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "计算评分失败");
    } finally {
      setComputing(false);
    }
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
            GEO 评分
          </span>
          <h1 className="mt-1 text-2xl font-semibold">品牌 AI 可见度评分</h1>
        </div>
        <Button onClick={handleCompute} disabled={computing}>
          {computing ? "计算中..." : score ? "重新计算评分" : "计算评分"}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {score === undefined && <p className="mt-8 text-sm text-neutral-500">加载中...</p>}

      {score === null && (
        <Card className="mt-8">
          <p className="text-sm text-neutral-500">
            还没有生成过 GEO 评分。点击右上角「计算评分」，系统会结合企业资料、内容覆盖与关键词监测结果生成评分。
          </p>
        </Card>
      )}

      {score && (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center gap-2 py-10 lg:col-span-1">
            <span className="font-mono text-xs uppercase tracking-wide text-neutral-500">
              总分
            </span>
            <span className="font-mono text-6xl font-semibold tabular-nums text-brand-500">
              {score.total_score}
            </span>
            <span className="text-sm text-neutral-500">满分 100</span>
          </Card>

          <Card className="flex flex-col gap-5 lg:col-span-2">
            <ScoreBar label="品牌权威" value={score.authority_score} max={30} />
            <ScoreBar label="内容覆盖" value={score.content_score} max={30} />
            <ScoreBar label="AI 理解度" value={score.ai_understanding_score} max={20} />
            <ScoreBar label="用户信任" value={score.trust_score} max={20} />
          </Card>

          {score.strengths && score.strengths.length > 0 && (
            <Card className="lg:col-span-3">
              <h2 className="text-sm font-semibold">优势</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {score.strengths.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="text-emerald-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {score.recommendations && score.recommendations.length > 0 && (
            <Card className="lg:col-span-3">
              <h2 className="text-sm font-semibold">优化建议</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {score.recommendations.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="text-brand-500">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </AppShell>
  );
}
