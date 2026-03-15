"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "@/lib/auth";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const raw = searchParams.get("redirect") ?? "";
  const redirectTo = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/home";

  useEffect(() => {
    if (!loading && user) router.replace(redirectTo);
  }, [user, loading, router, redirectTo]);

  const handleSignIn = () => {
    setError(null);
    setIsSubmitting(true);
    signIn(email, password)
      .then(() => router.replace(redirectTo))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsSubmitting(false));
  };

  if (loading || user) return null;

  const signUpHref = raw ? `/signup?redirect=${encodeURIComponent(raw)}` : "/signup";

  return (
    <div className="flex min-h-full items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-(--radius-card) border p-8 shadow-(--shadow-card)"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "color-mix(in srgb, var(--color-accent-2) 24%, white)",
        }}
      >
        <h2
          className="text-center text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{ color: "var(--color-text)" }}
        >
          ログイン
        </h2>

        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition disabled:opacity-70"
              style={{
                borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition disabled:opacity-70"
              style={{
                borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
              }}
            />
          </div>

          {error && (
            <p
              className="rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: "color-mix(in srgb, #e03131 35%, white)",
                backgroundColor: "color-mix(in srgb, #e03131 10%, white)",
                color: "color-mix(in srgb, #b02121 90%, black)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            style={{ backgroundColor: "var(--color-accent-2)" }}
          >
            {isSubmitting ? "送信中..." : "ログイン"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}>
          アカウントをお持ちでない方は{" "}
          <Link
            href={signUpHref}
            className="font-semibold underline decoration-2 underline-offset-4"
            style={{ color: "var(--color-accent-2)" }}
          >
            新規登録はこちら
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
