"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { ApiError } from "@/lib/api";
import { CurrentUser, getCurrentUser, getToken, logout } from "@/lib/auth";
import { DashboardSummary, getDashboardSummary } from "@/lib/dashboard";
import { AI_MODEL_LABELS } from "@/lib/keywords";
import { DailyStrategy, getDailyStrategy } from "@/lib/strategy";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const GRID_COLOR = "rgba(148, 163, 184, 0.25)";
const AXIS_COLOR = "#94a3b8";
const BRAND_COLOR = "#0E7C86";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [strategy, setStrategy] = useState<DailyStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    Promise.all([getCurrentUser(), getDashboardSummary(), getDailyStrategy()])
      .then(([userRes, summaryRes, strategyRes]) => {
        setUser(userRes);
        setSummary(summaryRes);
        setStrategy(strategyRes);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace("/login");
          return;
        }
        setError(err instanceof ApiError ? err.message : "加载失败");
      });
  }, [router]);

  if (!user || !summary) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
        {error ?? "加载中..."}
      </main>
    );
  }

  const hasKeywords = summary.keywords_count > 0;
  const trendUp = (summary.score_change_pct ?? 0) >= 0;

  const modelChartData = summary.model_stats.map((s) => ({
    name: AI_MODEL_LABELS[s.ai_model],
    提及率: s.total_tasks ? Math.round((s.mentioned_count / s.total_tasks) * 100) : 0,
  }));

  const scoreChartData = summary.score_history.map((p) => ({
    date: new Date(p.created_at).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
    score: p.total_score,
  }));

  return (
    <AppShell>
      <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
        GEO 驾驶舱
      </span>
      <h1 className="mt-1 text-2xl font-semibold">
        欢迎回来，{user.full_name ?? user.email}
      </h1>

      {!hasKeywords && (
        <Card className="mt-6">
          <p className="text-sm text-neutral-500">
            还没有关键词监测数据。前往{" "}
            <Link href="/keywords" className="text-brand-500 hover:underline">
              关键词监测
            </Link>{" "}
            添加关键词并运行监测，驾驶舱数据会自动更新。
          </p>
        </Card>
      )}

      {strategy && strategy.tasks.length > 0 && (
        <Card className="mt-6">
          <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">
            今日任务
          </span>
          <ul className="mt-3 flex flex-col gap-2.5">
            {strategy.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 shrink-0 rounded-full bg-brand-50 px-2 py-0.5 font-mono text-[10px] text-brand-600 dark:bg-brand-900 dark:text-brand-300">
                  {task.category}
                </span>
                <span className="text-neutral-700 dark:text-neutral-300">{task.description}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">
            品牌 AI 可见度
          </span>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-mono text-5xl font-semibold tabular-nums text-brand-500">
              {summary.latest_score ?? "—"}
            </span>
            <span className="text-sm text-neutral-400">/ 100</span>
            {summary.score_change_pct !== null && (
              <span
                className={`font-mono text-sm ${trendUp ? "text-emerald-600" : "text-red-600"}`}
              >
                {trendUp ? "↑" : "↓"} {Math.abs(summary.score_change_pct)}%
              </span>
            )}
          </div>
          {scoreChartData.length > 1 && (
            <div className="mt-4 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreChartData}>
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={BRAND_COLOR}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <XAxis dataKey="date" hide />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {summary.latest_score === null && (
            <p className="mt-4 text-xs text-neutral-400">
              前往{" "}
              <Link href="/scores" className="text-brand-500 hover:underline">
                GEO 评分
              </Link>{" "}
              计算首次评分
            </p>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatCard
            label="AI 引用次数"
            value={String(summary.citation_count)}
            hint="第三方来源引用总数"
          />
          <StatCard
            label="品牌出现频率"
            value={summary.mention_rate !== null ? `${Math.round(summary.mention_rate * 100)}%` : "—"}
            hint={`${summary.mentioned_tasks} / ${summary.total_ai_tasks} 次监测中被提及`}
          />
          <StatCard
            label="平均推荐排名"
            value={
              summary.average_mention_position !== null
                ? `第 ${summary.average_mention_position} 位`
                : "—"
            }
            hint="被提及时的平均排名位置"
          />
          <StatCard
            label="内容覆盖率"
            value={
              summary.content_coverage_pct !== null ? `${summary.content_coverage_pct}%` : "—"
            }
            hint="内容维度评分占比"
          />
        </div>
      </div>

      {modelChartData.length > 0 && (
        <Card className="mt-6">
          <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">
            分引擎提及率
          </span>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                <XAxis dataKey="name" stroke={AXIS_COLOR} fontSize={12} />
                <YAxis stroke={AXIS_COLOR} fontSize={12} unit="%" width={40} />
                <Tooltip formatter={(value: number) => [`${value}%`, "提及率"]} />
                <Bar
                  dataKey="提及率"
                  fill={BRAND_COLOR}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div className="mt-8 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          退出登录
        </Button>
      </div>
    </AppShell>
  );
}
