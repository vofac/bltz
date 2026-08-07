import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEO Intelligence Platform",
  description: "企业级生成式引擎优化（GEO）智能系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
