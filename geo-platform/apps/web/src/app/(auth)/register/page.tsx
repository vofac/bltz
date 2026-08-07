"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: "",
    full_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "注册失败，请稍后重试");
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
        <h1 className="mt-2 text-xl font-semibold">创建企业账户</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <Label htmlFor="company_name">企业名称</Label>
            <Input
              id="company_name"
              required
              value={form.company_name}
              onChange={update("company_name")}
              placeholder="例如：佰利新材"
            />
          </div>
          <div>
            <Label htmlFor="full_name">姓名</Label>
            <Input
              id="full_name"
              required
              value={form.full_name}
              onChange={update("full_name")}
            />
          </div>
          <div>
            <Label htmlFor="email">企业邮箱</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={update("password")}
              placeholder="至少 8 位"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "创建中..." : "创建账户"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          已有账户？{" "}
          <Link href="/login" className="text-brand-500 hover:underline">
            去登录
          </Link>
        </p>
      </Card>
    </main>
  );
}
