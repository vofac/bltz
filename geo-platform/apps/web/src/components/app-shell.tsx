"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "GEO 驾驶舱" },
  { href: "/keywords", label: "关键词监测" },
  { href: "/scores", label: "GEO 评分" },
  { href: "/competitors", label: "竞品分析" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs uppercase tracking-wide text-brand-500">
              GEO Intelligence Platform
            </span>
            <nav className="flex gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium",
                    pathname === item.href
                      ? "text-brand-500"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
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
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
