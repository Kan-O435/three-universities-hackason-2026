"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signUp } from "@/lib/auth";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const raw = searchParams.get("redirect") ?? "";
  const redirectTo = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/home";

  useEffect(() => {
    if (!loading && user) router.replace(redirectTo);
  }, [user, loading, router, redirectTo]);

  const handleSignUp = () => {
    if (!displayName.trim()) {
      setError("Please enter a display name.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    signUp(email, password, displayName.trim())
      .then(() => router.replace(redirectTo))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsSubmitting(false));
  };

  if (loading || user) return null;

  const signInHref = raw ? `/signin?redirect=${encodeURIComponent(raw)}` : "/signin";

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
          Sign Up
        </h2>

        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
          <Field label="Display Name" id="displayName" type="text" value={displayName} onChange={setDisplayName} disabled={isSubmitting} maxLength={40} />
          <Field label="Email" id="email" type="email" value={email} onChange={setEmail} disabled={isSubmitting} />
          <Field label="Password" id="password" type="password" value={password} onChange={setPassword} disabled={isSubmitting} />
          {error && <ErrorMessage text={error} />}
          <SubmitButton label="Sign Up" loading={isSubmitting} />
        </form>

        <p className="mt-5 text-center text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}>
          Already have an account?{" "}
          <Link
            href={signInHref}
            className="font-semibold underline decoration-2 underline-offset-4"
            style={{ color: "var(--color-accent-2)" }}
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}

type FieldProps = {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  maxLength?: number;
};

function Field({ label, id, type, value, onChange, disabled, maxLength }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={maxLength}
        required
        className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      />
    </div>
  );
}

function ErrorMessage({ text }: { text: string }) {
  return (
    <p
      className="rounded-lg border px-4 py-3 text-sm"
      style={{
        borderColor: "color-mix(in srgb, #e03131 35%, white)",
        backgroundColor: "color-mix(in srgb, #e03131 10%, white)",
        color: "color-mix(in srgb, #b02121 90%, black)",
      }}
    >
      {text}
    </p>
  );
}

function SubmitButton({ label, loading }: { label: string; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
      style={{ backgroundColor: "var(--color-accent-2)" }}
    >
      {loading ? "Submitting..." : label}
    </button>
  );
}
