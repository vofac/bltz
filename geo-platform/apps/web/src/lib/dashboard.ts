import { apiFetch } from "@/lib/api";
import { AIModel } from "@/lib/keywords";

export interface ScorePoint {
  created_at: string;
  total_score: number;
}

export interface ModelMentionStat {
  ai_model: AIModel;
  total_tasks: number;
  mentioned_count: number;
}

export interface DashboardSummary {
  latest_score: number | null;
  previous_score: number | null;
  score_change_pct: number | null;
  score_history: ScorePoint[];
  keywords_count: number;
  total_ai_tasks: number;
  mentioned_tasks: number;
  mention_rate: number | null;
  citation_count: number;
  average_mention_position: number | null;
  content_coverage_pct: number | null;
  model_stats: ModelMentionStat[];
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("/api/v1/dashboard/summary");
}
