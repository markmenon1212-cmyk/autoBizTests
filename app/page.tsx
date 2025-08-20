'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs'
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Bot,
  CheckCircle,
  Sparkles,
  LineChart,
  Lock,
  Boxes,
  Rocket,
  PlayCircle,
  Star,
  MessageCircle,
} from 'lucide-react'

/**
 * AutoBiz AI — Enhanced Landing Page
 * - Pure React + Tailwind (no custom utility classes required)
 * - Accessible buttons, focus rings, and keyboard navigation
 * - Responsive layouts, tasteful motion (CSS only), and dense information hierarchy
 * - Clerk sign-in/up buttons are preserved
 */
export default function HomePage() {
  const { isSignedIn } = useUser()
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: <Zap className="h-6 w-6" aria-hidden />,
      title: 'AI-Powered Automation',
      description:
        'Generate content, schedule posts, optimize SEO, and handle reviews with autonomous agents tuned to your brand.',
      points: ['Auto-posting & scheduling', 'On-brand drafts in seconds', 'Agent handoff & approvals'],
    },
    {
      icon: <Shield className="h-6 w-6" aria-hidden />,
      title: 'Secure Integrations',
      description:
        'Enterprise-grade OAuth2 with granular scopes, audit logs, and secrets vaulting across environments.',
      points: ['SOC2-ready patterns', 'Scoped tokens & rotation', 'Row-level access controls'],
    },
    {
      icon: <BarChart3 className="h-6 w-6" aria-hidden />,
      title: 'Analytics & Insights',
      description:
        'At-a-glance KPIs, funnel breakdowns, and cohort views—exportable to CSV or your BI warehouse.',
      points: ['Realtime dashboards', 'Attribution & UTM insights', 'Anomaly alerts'],
    },
    {
      icon: <Bot className="h-6 w-6" aria-hidden />,
      title: 'Smart Workflows',
      description:
        'Drag-and-drop workflows that adapt to triggers, sentiment, and conversion goals—no code required.',
      points: ['Event & webhook triggers', 'If/Then branches', 'Human-in-the-loop review'],
    },
  ]

  const integrations = [
    'Gmail & Google Workspace',
    'Slack & Twitter/X',
    'Shopify & WooCommerce',
    'Vercel & Namecheap',
    'Google Business Profile',
    'WhatsApp Business',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Wire up to your backend/api route
    if (email.trim()) {
      alert(`Thanks! We\'ll be in touch at ${email}.`) // Replace with toast if you have one
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(80%_80%_at_50%_20%,#e0e7ff_0%,#c7d2fe_40%,#eef2ff_100%)] text-gray-900">
      {/* Top Announcement Bar */}
      <div className="sticky top-0 z-[60] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2">
          <Sparkles className="h-4 w-4" aria-hidden />
          <span>
            New: <strong>AutoFlows</strong> visual builder now in beta.{' '}
            <Link href="#demo" className="underline underline-offset-4 hover:opacity-90">
              Watch 90‑sec demo
            </Link>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-[32px] z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
              <Boxes className="h-5 w-5 text-indigo-600" aria-hidden />
              <span className="text-sm font-semibold tracking-tight">AutoBiz AI</span>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Features
            </Link>
            <Link href="#integrations" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Integrations
            </Link>
            <Link href="#how" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              How it works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Sign in"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Get started"
                  >
                    Get Started <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:20px_20px]"
        />
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 md:pt-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-6xl">
              Automate your growth with
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent [-webkit-text-fill-color:transparent] pb-[0.12em]">
                AI-Powered Intelligence
              </span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Connect websites, socials, and stores—then let agents produce content, schedule posts, optimize SEO, and
              turn reviews into revenue while you focus on building.
            </p>

            {!isSignedIn && (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow transition hover:shadow-lg hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </button>
                </SignUpButton>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <PlayCircle className="h-5 w-5" aria-hidden /> Watch Demo
                </a>
              </div>
            )}

            {/* Email capture */}
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border-0 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Get Early Access
              </button>
            </form>

            {/* Trust bar */}
            <div className="mt-10 grid grid-cols-2 items-center justify-items-center gap-6 opacity-80 sm:grid-cols-4">
              {[
                { label: '99.95% Uptime', icon: <Lock className="h-4 w-4" aria-hidden /> },
                { label: 'GDPR Friendly', icon: <Shield className="h-4 w-4" aria-hidden /> },
                { label: 'Realtime KPIs', icon: <LineChart className="h-4 w-4" aria-hidden /> },
                { label: 'One‑click Setup', icon: <Rocket className="h-4 w-4" aria-hidden /> },
              ].map((i, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                  {i.icon}
                  {i.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to scale</h2>
            <p className="mt-3 text-lg text-gray-600">
              Powerful integrations and adaptive AI workflows designed for modern businesses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.description}</p>
                <ul className="mt-4 space-y-2">
                  {f.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Launch in minutes</h2>
            <p className="mt-3 text-lg text-gray-600">Connect, configure, and convert—no engineers required.</p>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Connect Accounts',
                body: 'Securely link socials, email, and storefronts with OAuth2 and scoped permissions.',
              },
              { step: '02', title: 'Pick a Blueprint', body: 'Choose a workflow preset or start from a blank canvas.' },
              {
                step: '03',
                title: 'Review & Go Live',
                body: 'Approve agent drafts, set schedules, and enable auto-optimizations.',
              },
            ].map((s, i) => (
              <li key={i} className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-3 inline-flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {s.step}
                  </span>
                  <span className="text-sm font-medium text-gray-700">Step</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Native Integrations</h2>
            <p className="mt-3 text-lg text-gray-600">Connect your favorite tools, from comms to commerce.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((label, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-500" aria-hidden />
                <span className="text-gray-800">{label}</span>
              </div>
            ))}
          </div>

          {/* Small CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/docs/integrations"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Browse Integration Docs <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            {/* Testimonials */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden />
              </div>
              <blockquote className="mt-4 text-lg font-medium text-gray-900">
                “AutoBiz replaced our 4-tool stack and gave us weekly SEO lift without extra headcount.”
              </blockquote>
              <p className="mt-2 text-sm text-gray-600">— Maya P., Growth Lead @ DTC skincare brand</p>
            </div>

            {/* Mini FAQ */}
            <div className="space-y-4">
              {[
                {
                  q: 'Is my data safe?',
                  a: 'Yes. We use OAuth2 with scoped permissions, encryption at rest/in transit, and per-tenant isolation.',
                },
                {
                  q: 'Can I approve content before posting?',
                  a: 'Absolutely. Enable human-in-the-loop to review all drafts, or auto-publish with guardrails.',
                },
                {
                  q: 'How long does setup take?',
                  a: 'Most teams connect and launch a blueprint in under 10 minutes—no engineers required.',
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="mt-0.5 h-5 w-5 text-indigo-600" aria-hidden />
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{item.q}</h4>
                      <p className="mt-1 text-sm text-gray-600">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Primary CTA */}
      <section className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to transform your business?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-indigo-100">
            Join thousands of teams automating their workflows with AI agents and realtime insights.
          </p>
          {!isSignedIn && (
            <div className="mt-8 inline-flex gap-3">
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow transition hover:shadow-lg">
                  Start your free trial <ArrowRight className="h-5 w-5" aria-hidden />
                </button>
              </SignUpButton>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-transparent px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                See Pricing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-14 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-white">
                <Boxes className="h-5 w-5" aria-hidden />
                <span className="text-sm font-semibold">AutoBiz AI</span>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Empowering small businesses with intelligent automation.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#integrations" className="hover:text-white">Integrations</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Support</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
                <li><Link href="/community" className="hover:text-white">Community</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} AutoBiz AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
