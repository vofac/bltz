import { apiFetch } from "@/lib/api";

export interface StrategyTask {
  category: string;
  description: string;
}

export interface DailyStrategy {
  date: string;
  tasks: StrategyTask[];
}

export function getDailyStrategy(): Promise<DailyStrategy> {
  return apiFetch<DailyStrategy>("/api/v1/strategy/daily");
}
