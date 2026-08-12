import { apiFetch } from "@/lib/api";

export interface Competitor {
  id: string;
  name: string;
  website: string | null;
  company_id: string;
  created_at: string;
}

export interface ComparisonEntry {
  name: string;
  is_own_brand: boolean;
  geo_score: number | null;
  mention_count: number;
  mention_rate: number | null;
}

export interface ComparisonResult {
  total_ai_tasks: number;
  entries: ComparisonEntry[];
  opportunities: string[];
}

export function listCompetitors(): Promise<Competitor[]> {
  return apiFetch<Competitor[]>("/api/v1/competitors");
}

export function createCompetitor(name: string, website?: string): Promise<Competitor> {
  return apiFetch<Competitor>("/api/v1/competitors", {
    method: "POST",
    body: JSON.stringify({ name, website: website || null }),
  });
}

export function deleteCompetitor(id: string): Promise<void> {
  return apiFetch<void>(`/api/v1/competitors/${id}`, { method: "DELETE" });
}

export function getComparison(): Promise<ComparisonResult> {
  return apiFetch<ComparisonResult>("/api/v1/competitors/comparison");
}
