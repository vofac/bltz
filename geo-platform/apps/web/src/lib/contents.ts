import { apiFetch } from "@/lib/api";

export type ContentStatus = "draft" | "published";

export interface ContentListItem {
  id: string;
  title: string;
  status: ContentStatus;
  created_at: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Content {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  faq: FaqItem[] | null;
  schema_jsonld: Record<string, unknown> | null;
  status: ContentStatus;
  created_at: string;
}

export function listContents(): Promise<ContentListItem[]> {
  return apiFetch<ContentListItem[]>("/api/v1/contents");
}

export function getContent(id: string): Promise<Content> {
  return apiFetch<Content>(`/api/v1/contents/${id}`);
}

export function generateContent(keyword: string): Promise<Content> {
  return apiFetch<Content>("/api/v1/contents/generate", {
    method: "POST",
    body: JSON.stringify({ keyword }),
  });
}

export function publishContent(id: string): Promise<Content> {
  return apiFetch<Content>(`/api/v1/contents/${id}/publish`, { method: "POST" });
}

export function deleteContent(id: string): Promise<void> {
  return apiFetch<void>(`/api/v1/contents/${id}`, { method: "DELETE" });
}
