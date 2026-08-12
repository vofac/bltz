import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
        GEO Intelligence Platform
      </span>
      <h1 className="text-3xl font-semibold">企业级生成式引擎优化智能系统</h1>
      <p className="max-w-md text-sm text-neutral-500">
        量化并提升品牌在 ChatGPT / Claude / Gemini / Perplexity / Google AI Overview 中的曝光与推荐概率。
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/login">
          <Button variant="ghost">登录</Button>
        </Link>
        <Link href="/register">
          <Button>免费开始</Button>
        </Link>
      </div>
    </main>
  );
}
