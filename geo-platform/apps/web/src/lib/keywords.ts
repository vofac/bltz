import { apiFetch } from "@/lib/api";

export type AIModel = "openai" | "claude" | "gemini" | "perplexity" | "google_aio";
export type TaskStatus = "pending" | "running" | "completed" | "failed";

export const AI_MODEL_LABELS: Record<AIModel, string> = {
  openai: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  perplexity: "Perplexity",
  google_aio: "Google AI Overview",
};

export interface Keyword {
  id: string;
  text: string;
  brand_id: string | null;
  company_id: string;
  created_at: string;
}

export interface AIResult {
  brand_mentioned: boolean;
  mention_position: number | null;
  raw_answer: string;
  citation_sources: string[] | null;
  competitor_brands_mentioned: string[] | null;
}

export interface AITask {
  id: string;
  ai_model: AIModel;
  status: TaskStatus;
  created_at: string;
  completed_at: string | null;
  result: AIResult | null;
}

export function listKeywords(): Promise<Keyword[]> {
  return apiFetch<Keyword[]>("/api/v1/keywords");
}

export function createKeyword(text: string): Promise<Keyword> {
  return apiFetch<Keyword>("/api/v1/keywords", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function monitorKeyword(keywordId: string): Promise<AITask[]> {
  return apiFetch<AITask[]>(`/api/v1/keywords/${keywordId}/monitor`, {
    method: "POST",
  });
}

export function listKeywordTasks(keywordId: string): Promise<AITask[]> {
  return apiFetch<AITask[]>(`/api/v1/keywords/${keywordId}/tasks`);
}
