"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CurrentUser, getCurrentUser, getToken, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => {
        logout();
        router.replace("/login");
      });
  }, [router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
        加载中...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
            GEO 驾驶舱
          </span>
          <h1 className="mt-1 text-2xl font-semibold">欢迎回来，{user.full_name ?? user.email}</h1>
        </div>
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
      <p className="mt-6 text-sm text-neutral-500">
        品牌 AI 可见度评分卡与趋势图即将上线（Phase 1 后续模块）。
      </p>
    </main>
  );
}
