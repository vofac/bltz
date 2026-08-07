"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
          GEO Intelligence Platform
        </span>
        <h1 className="mt-2 text-xl font-semibold">登录</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <Label htmlFor="email">企业邮箱</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "登录中..." : "登录"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          还没有企业账户？{" "}
          <Link href="/register" className="text-brand-500 hover:underline">
            立即注册
          </Link>
        </p>
      </Card>
    </main>
  );
}
