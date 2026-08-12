import { apiFetch, ApiError } from "@/lib/api";

export interface Score {
  id: string;
  brand_id: string;
  authority_score: number;
  content_score: number;
  ai_understanding_score: number;
  trust_score: number;
  total_score: number;
  strengths: string[] | null;
  recommendations: string[] | null;
  created_at: string;
}

export async function getLatestScore(): Promise<Score | null> {
  try {
    return await apiFetch<Score>("/api/v1/scores/latest");
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export function computeScore(): Promise<Score> {
  return apiFetch<Score>("/api/v1/scores/compute", { method: "POST" });
}

export function getScoreHistory(): Promise<Score[]> {
  return apiFetch<Score[]>("/api/v1/scores/history");
}
