import React from "react";
import { ArrowRight, BarChart3, BellRing, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Live Expense Dashboard",
    description: "Track income, spending, and savings trends in one focused view.",
    icon: BarChart3,
  },
  {
    title: "Smart Bill Reminders",
    description: "Stay ahead of due dates and keep your monthly flow under control.",
    icon: BellRing,
  },
  {
    title: "Private By Default",
    description: "Your personal finance snapshots stay local to your experience.",
    icon: ShieldCheck,
  },
];

function Landing() {
  return (
    <div className="landing-page relative min-h-screen overflow-hidden bg-[#fbfaf7] text-[#1f2a37]">
      <div className="landing-orb landing-orb-a" />
      <div className="landing-orb landing-orb-b" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0f766e] text-white shadow-[0_10px_25px_rgba(15,118,110,0.35)]">
            <Sparkles size={18} />
          </div>
          <p className="landing-brand text-xl font-bold">ExpenseTracker</p>
        </div>

        <Link
          to="/app"
          className="rounded-full border border-[#0f766e]/25 bg-white px-5 py-2 text-sm font-semibold text-[#0f766e] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,118,110,0.25)]"
        >
          Open App
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 pb-16 pt-4 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <section className="landing-fade-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f59e0b]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#b45309]">
            Personal Finance, Simplified
          </p>

          <h1 className="landing-display text-4xl leading-tight font-bold text-[#111827] sm:text-5xl lg:text-6xl">
            Build Better Money Habits
            <span className="block text-[#0f766e]">Without Spreadsheet Chaos</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#4b5563] sm:text-lg">
            Organize transactions, monitor recurring payments, and get a clean snapshot of your financial health with a dashboard designed for daily decisions.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,118,110,0.3)] transition hover:-translate-y-0.5 hover:bg-[#115e59]"
            >
              Start Tracking
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>

            <Link
              to="/app/transactions"
              className="rounded-xl border border-[#111827]/10 bg-white px-6 py-3 text-sm font-semibold text-[#1f2937] transition hover:-translate-y-0.5 hover:border-[#0f766e]/30 hover:text-[#0f766e]"
            >
              View Transactions
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <div>
              <p className="landing-metric text-2xl font-bold text-[#111827]">12k+</p>
              <p className="text-[#6b7280]">Entries Managed</p>
            </div>
            <div>
              <p className="landing-metric text-2xl font-bold text-[#111827]">99.9%</p>
              <p className="text-[#6b7280]">Uptime Feel</p>
            </div>
            <div>
              <p className="landing-metric text-2xl font-bold text-[#111827]">4.9/5</p>
              <p className="text-[#6b7280]">User Experience</p>
            </div>
          </div>
        </section>

        <section className="landing-fade-up landing-delay grid gap-4">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#111827]/10 bg-white/90 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-[#ecfeff] text-[#0f766e]">
                  <item.icon size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#4b5563]">{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Landing;
