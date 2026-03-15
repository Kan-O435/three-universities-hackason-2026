import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-(--max-width-content) items-center px-(--page-padding) py-8 md:py-12">
        <div className="grid w-full grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <section
            className="rounded-(--radius-card) border p-6 shadow-(--shadow-card) sm:p-8"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "color-mix(in srgb, var(--color-accent-2) 24%, white)",
            }}
            aria-labelledby="about-title"
          >
            <div
              className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "color-mix(in srgb, var(--color-accent-2) 22%, white)" }}
            >
              <Image
                src="/illustrations/flash-sns-hero.svg"
                alt="期限つきコミュニティで瞬間的な交流が生まれる様子"
                width={760}
                height={440}
                className="h-auto w-full"
                priority
              />
            </div>

            <h2
              id="about-title"
              className="mt-4 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
              style={{ color: "var(--color-text)" }}
            >
              イベント期間だけ使う<br/>短期コミュニティ向けSNS
            </h2>

            <p className="mt-3 text-sm leading-7 sm:text-base" style={{ color: "color-mix(in srgb, var(--color-text) 84%, white)" }}>
              ハッカソンや授業のあいだだけ使えるチャットです。
              終了後はつながりが残らないので、必要な人とだけ次の連絡先を交換できます。
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <article
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-accent-2) 8%, white)",
                  borderColor: "color-mix(in srgb, var(--color-accent-2) 30%, white)",
                }}
              >
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  その場ですぐ参加
                </h3>
                <p className="mt-1 text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}>
                  招待リンクからすぐ入室。初対面でも会話を始めやすい設計です。
                </p>
              </article>

              <article
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-accent-1) 26%, white)",
                  borderColor: "color-mix(in srgb, var(--color-accent-1) 46%, white)",
                }}
              >
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  期限つきで集中
                </h3>
                <p className="mt-1 text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}>
                  残り時間が見えるので、いま必要な相談に集中できます。
                </p>
              </article>

              <article
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-accent-2) 10%, white)",
                  borderColor: "color-mix(in srgb, var(--color-accent-2) 32%, white)",
                }}
              >
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  終了後は匿名化
                </h3>
                <p className="mt-1 text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}>
                  期間終了後は名前が外れ、会話の流れだけを見返せます。
                </p>
              </article>
            </div>
          </section>

          <section
            className="w-full rounded-(--radius-card) border p-6 shadow-(--shadow-card) sm:p-8 lg:max-w-md lg:justify-self-end"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "color-mix(in srgb, var(--color-accent-2) 24%, white)",
            }}
            aria-labelledby="login-title"
          >
            <h2
              id="login-title"
              className="text-2xl font-semibold tracking-tight sm:text-3xl text-center"
              style={{ color: "var(--color-text)" }}
            >
              ログイン
            </h2>

            <form className="mt-6 space-y-4" action="#" method="post">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  名前
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="山田 太郎"
                  className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    boxShadow: "0 0 0 0 transparent",
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="sample@example.com"
                  className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
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
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
                  style={{
                    borderColor: "color-mix(in srgb, var(--color-accent-2) 34%, white)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition hover:brightness-95"
                style={{
                  backgroundColor: "var(--color-accent-2)",
                  color: "white",
                }}
              >
                ログイン
              </button>
            </form>

            <p className="mt-5 text-center text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 78%, white)" }}>
              アカウントをお持ちでない方は{" "}
              <Link
                href="#"
                className="font-semibold underline decoration-2 underline-offset-4"
                style={{ color: "var(--color-accent-2)" }}
              >
                新規登録はこちら
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
