import { apiFetch } from "@/lib/api";

export interface DocumentListItem {
  id: string;
  filename: string;
  file_type: string;
  created_at: string;
}

export interface DocumentDetail {
  id: string;
  filename: string;
  file_type: string;
  extracted_text: string | null;
  chunk_count: number;
  created_at: string;
}

export interface SearchResultItem {
  document_id: string;
  filename: string;
  chunk_text: string;
  score: number;
}

export function listDocuments(): Promise<DocumentListItem[]> {
  return apiFetch<DocumentListItem[]>("/api/v1/documents");
}

export function uploadDocument(file: File): Promise<DocumentDetail> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<DocumentDetail>("/api/v1/documents/upload", {
    method: "POST",
    body: formData,
  });
}

export function deleteDocument(id: string): Promise<void> {
  return apiFetch<void>(`/api/v1/documents/${id}`, { method: "DELETE" });
}

export async function searchDocuments(query: string): Promise<SearchResultItem[]> {
  const res = await apiFetch<{ results: SearchResultItem[] }>("/api/v1/documents/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  return res.results;
}
