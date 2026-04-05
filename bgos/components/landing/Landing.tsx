"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC]";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const features = [
  {
    title: "Automation that adapts",
    body: "Workflows learn your rhythm and remove repetitive work without losing control.",
  },
  {
    title: "Unified operations",
    body: "One calm surface for leads, delivery, and revenue — no tab chaos.",
  },
  {
    title: "Growth intelligence",
    body: "Signals, not noise. Clear next steps when your business is ready to scale.",
  },
  {
    title: "Secure by design",
    body: "Enterprise-grade posture with sensible defaults for teams of any size.",
  },
  {
    title: "Human support",
    body: "Real people when you need them; the system handles the rest.",
  },
  {
    title: "Always improving",
    body: "Continuous updates — you wake up to a sharper product, not more chores.",
  },
];

function DashboardMock() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative rounded-2xl border border-gray-200 bg-white/60 p-6 shadow-xl backdrop-blur-xl md:p-8"
      animate={
        reduce
          ? {}
          : {
              y: [-10, 10, -10],
            }
      }
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "MRR", value: "₹12.4L", delta: "+18%" },
          { label: "Leads", value: "842", delta: "+32%" },
          { label: "Tasks", value: "12", delta: "Auto" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-gray-100 bg-white/80 px-3 py-3 shadow-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {m.label}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-800">{m.value}</p>
            <p className="text-xs font-medium text-emerald-600">{m.delta}</p>
          </div>
        ))}
      </div>

      <div className="relative h-40 rounded-xl border border-gray-100 bg-gradient-to-b from-white to-slate-50/80 px-2 pt-4">
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 shadow-sm ring-1 ring-slate-100">
          <span className="relative flex h-2 w-2">
            {!reduce ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            ) : null}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Live
          </span>
        </div>
        <p className="mb-2 px-2 text-xs font-semibold text-slate-500">Revenue trajectory</p>
        <svg viewBox="0 0 320 120" className="h-28 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,90 C40,85 60,40 100,55 S200,20 260,35 S300,15 320,25 L320,120 L0,120 Z"
            fill="url(#areaGrad)"
            initial={false}
          />
          <motion.path
            d="M0,90 C40,85 60,40 100,55 S200,20 260,35 S300,15 320,25"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] as const }}
          />
        </svg>

        <motion.div
          className="absolute bottom-3 right-3 max-w-[200px] rounded-xl border border-gray-200 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-md"
          initial={{ opacity: 0, x: 16, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: reduce ? 0 : 0.9, duration: 0.45 }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            BGOS
          </p>
          <p className="text-sm font-semibold text-slate-800">3 leads qualified</p>
          <p className="text-xs text-slate-500">Automation handled follow-ups.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AmbientDepth({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-[20%] top-[12%] h-[min(28rem,85vw)] w-[min(28rem,85vw)] rounded-full bg-red-500/[0.05] blur-3xl"
        animate={reduce ? {} : { x: [0, 16, 0], y: [0, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[15%] top-[38%] h-[min(24rem,75vw)] w-[min(24rem,75vw)] rounded-full bg-amber-400/[0.07] blur-3xl"
        animate={reduce ? {} : { x: [0, -12, 0], y: [0, 14, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[15%] h-[min(18rem,55vw)] w-[min(18rem,55vw)] rounded-full bg-slate-400/[0.06] blur-3xl"
        animate={reduce ? {} : { scale: [1, 1.05, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}

export function Landing() {
  const reduce = useReducedMotion();
  const [headerElevated, setHeaderElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderElevated(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]">
      <AmbientDepth reduce={Boolean(reduce)} />
      <div className="noise-overlay" aria-hidden />

      <header
        className={`sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-md transition-shadow duration-300 ${
          headerElevated ? "shadow-sm shadow-slate-200/60" : ""
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="BGOS" className="h-10 w-auto" />
            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">BGOS</p>
              <p className="text-[11px] font-medium leading-tight text-slate-500">
                Business Growth Operating System
              </p>
            </div>
          </div>
          <nav className="flex w-full items-center justify-end gap-5 sm:w-auto sm:gap-6">
            <Link
              href="/login"
              className={`text-sm font-semibold text-slate-600 transition hover:text-slate-900 ${focusRing} rounded-md`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={`rounded-full bg-gradient-to-r from-red-500 to-yellow-400 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-400/25 transition hover:scale-[1.03] hover:shadow-glow ${focusRing}`}
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-14">
          <div>
            <motion.p
              className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
            >
              BGOS – Business Growth Operating System
            </motion.p>
            <motion.h1
              className="text-5xl font-bold leading-[1.08] tracking-tight max-[380px]:text-4xl"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
            >
              <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                Run Your Business.
                <br />
                Not Your Problems.
              </span>
            </motion.h1>
            <motion.p
              className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
            >
              BGOS automates, manages, and grows your business — while you focus on what truly
              matters.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
            >
              <Link
                href="/signup"
                className={`inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-yellow-400 px-8 py-3 text-base font-bold text-white shadow-lg shadow-red-500/25 transition hover:scale-[1.02] hover:shadow-glow ${focusRing}`}
              >
                Start Free
              </Link>
              <Link
                href="#how"
                className={`inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-slate-200 bg-white/80 px-8 py-3 text-base font-semibold text-slate-800 backdrop-blur-sm transition hover:scale-[1.01] hover:border-slate-300 hover:shadow-md ${focusRing}`}
              >
                See How It Works
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <DashboardMock />
          </motion.div>
        </div>
      </section>

      {/* What is BGOS */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2
            className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            Your Business. Fully Automated.
          </motion.h2>
          <div className="mt-14 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-center md:gap-3">
            {[
              { label: "You", sub: "Strategy & craft" },
              { label: "BGOS", sub: "System & scale", highlight: true },
              { label: "Business", sub: "Growth on autopilot" },
            ].flatMap((step, i) => {
              const card = (
                <motion.div
                  key={step.label}
                  className={`flex min-h-[120px] min-w-[160px] flex-col items-center justify-center rounded-2xl border px-6 py-5 text-center shadow-sm transition ${
                    step.highlight
                      ? "border-red-200/80 bg-gradient-to-br from-white to-red-50/50 shadow-md"
                      : "border-gray-200 bg-white"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12 * i, duration: 0.45 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <span className="text-lg font-bold text-slate-900">{step.label}</span>
                  <span className="mt-1 text-sm text-slate-500">{step.sub}</span>
                </motion.div>
              );
              if (i === 0) return [card];
              const arrow = (
                <motion.span
                  key={`arrow-${i}`}
                  className="select-none text-2xl font-light text-slate-400 md:px-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 200 }}
                  aria-hidden
                >
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </motion.span>
              );
              return [arrow, card];
            })}
          </div>
        </div>
      </section>

      {/* Business Showers */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl overflow-hidden px-6 text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Hosting Business Showers
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Leads, revenue, automation — flowing continuously
          </motion.p>
          <div className="relative mt-16 h-52 md:h-56">
            {[
              { kind: "emoji" as const, icon: "₹", left: "6%", delay: 0 },
              { kind: "pill" as const, label: "Leads", left: "22%", delay: 0.8 },
              { kind: "emoji" as const, icon: "📈", left: "38%", delay: 0.4 },
              { kind: "pill" as const, label: "Charts", left: "54%", delay: 1.2 },
              { kind: "emoji" as const, icon: "📊", left: "70%", delay: 1.6 },
              { kind: "emoji" as const, icon: "🎯", left: "86%", delay: 0.2 },
            ].map((item) =>
              item.kind === "pill" ? (
                <motion.div
                  key={item.label + item.left}
                  className="absolute whitespace-nowrap rounded-full border border-slate-200/90 bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600 shadow-md backdrop-blur-sm"
                  style={{ left: item.left, top: 8 }}
                  animate={
                    reduce
                      ? {}
                      : {
                          y: [0, 160, 0],
                          opacity: [0.4, 1, 0.4],
                        }
                  }
                  transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "linear",
                    delay: item.delay,
                  }}
                  aria-hidden
                >
                  {item.label}
                </motion.div>
              ) : (
                <motion.span
                  key={item.icon + item.left}
                  className="absolute text-3xl md:text-4xl"
                  style={{ left: item.left, top: 0 }}
                  animate={
                    reduce
                      ? {}
                      : {
                          y: [0, 160, 0],
                          opacity: [0.35, 1, 0.35],
                          rotate: [0, 8, -6, 0],
                        }
                  }
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "linear",
                    delay: item.delay,
                  }}
                  aria-hidden
                >
                  {item.icon}
                </motion.span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2
            className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Built for calm, powerful operations
          </motion.h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.article
                key={f.title}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm will-change-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px", amount: 0.25 }}
                transition={{ delay: 0.06 * i, duration: 0.45 }}
                whileHover={{
                  y: -6,
                  boxShadow:
                    "0 25px 50px -12px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(239, 68, 68, 0.07), 0 0 48px -14px rgba(250, 204, 21, 0.2)",
                  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
                }}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-red-500/[0.07] to-yellow-400/[0.12] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-red-500 to-yellow-400"
                    aria-hidden
                  />
                  <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                </div>
                <p className="relative leading-relaxed text-slate-600">{f.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Peace */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/40 px-6 py-16 shadow-sm ring-1 ring-white/50 backdrop-blur-[2px]">
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-90"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(254, 226, 226, 0.5) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(254, 249, 195, 0.35) 0%, transparent 50%)",
              }}
            />
            <motion.h2
              className="relative text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Finally, a system that runs your business
            </motion.h2>
            <motion.p
              className="relative mx-auto mt-6 max-w-xl text-lg text-slate-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
            >
              Less noise. More signal. BGOS keeps operations intelligent so you stay focused on what
              only you can do.
            </motion.p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.05]"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            Let NEXA Run Your Business
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-slate-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Join teams who replaced chaos with a calm, intelligent operating layer.
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Link
              href="/signup"
              className={`inline-flex min-h-[56px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-yellow-400 px-12 py-4 text-lg font-bold text-white shadow-xl shadow-red-500/30 transition hover:scale-[1.04] hover:shadow-glow-lg ${focusRing}`}
            >
              Get started free
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} BGOS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className={`rounded hover:text-slate-800 ${focusRing}`}>
              Privacy
            </Link>
            <Link href="/terms" className={`rounded hover:text-slate-800 ${focusRing}`}>
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
