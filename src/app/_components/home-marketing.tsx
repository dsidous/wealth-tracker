'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Landmark,
  LineChart,
  Lock,
  PieChart,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [intersecting, setIntersecting] = useState(false);
  const show = reducedMotion || intersecting;

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setIntersecting(true);
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: show ? `${delayMs}ms` : '0ms' }}
      className={cn(
        'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

const chartHeights = [32, 52, 41, 68, 48, 76, 55, 84, 62, 91];

function PreviewChart() {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div
      className='flex h-36 items-end justify-between gap-1.5 px-2 pb-2 pt-6 sm:h-44 sm:gap-2'
      aria-hidden
    >
      {chartHeights.map((h, i) => (
        <div
          key={i}
          className='min-h-[4px] w-full max-w-[10%] origin-bottom rounded-t-sm bg-linear-to-t from-primary/90 to-chart-2/80 shadow-sm'
          style={{
            height: `${h}%`,
            ...(reducedMotion
              ? {}
              : {
                  animation: `home-bar-rise 1s cubic-bezier(0.22, 1, 0.36, 1) both`,
                  animationDelay: `${120 + i * 65}ms`,
                }),
          }}
        />
      ))}
    </div>
  );
}

export function HomeMarketing() {
  return (
    <div className='flex flex-1 flex-col gap-20 pb-20 sm:gap-24 sm:pb-24'>
      <section className='relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12 sm:py-16'>
        <div
          className='home-anim-ambient pointer-events-none absolute inset-0 opacity-40'
          style={{
            background:
              'linear-gradient(125deg, oklch(0.6171 0.1375 39.0427 / 0.12) 0%, oklch(0.6898 0.1581 290.4107 / 0.1) 45%, oklch(0.8816 0.0276 93.128 / 0.35) 100%)',
            backgroundSize: '200% 200%',
            animation: 'home-gradient-pan 18s ease-in-out infinite',
          }}
        />
        <div
          className='home-anim-ambient pointer-events-none absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-primary/20 blur-3xl'
          style={{ animation: 'home-float 14s ease-in-out infinite' }}
        />
        <div
          className='home-anim-ambient pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-chart-2/25 blur-3xl'
          style={{
            animation: 'home-float-delayed 16s ease-in-out infinite',
          }}
        />
        <div
          className='home-anim-ambient pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10'
          style={{ animation: 'home-pulse-ring 6s ease-in-out infinite' }}
        />

        <p className='animate-in fade-in slide-in-from-bottom-2 relative text-sm font-medium text-primary duration-700 fill-mode-both'>
          Wealth Tracker
        </p>
        <h1 className='animate-in fade-in slide-in-from-bottom-3 relative mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground delay-100 duration-700 fill-mode-both sm:text-4xl md:text-5xl'>
          See your net worth in one calm place
        </h1>
        <p className='animate-in fade-in slide-in-from-bottom-4 relative mx-auto mt-4 max-w-xl text-pretty text-muted-foreground delay-200 duration-700 fill-mode-both'>
          Add assets, pick a base currency, and watch totals update as your
          portfolio changes. Sign in to open your private dashboard.
        </p>
        <div className='animate-in fade-in zoom-in-95 relative mt-8 flex flex-wrap items-center justify-center gap-3 delay-300 duration-700 fill-mode-both'>
          <Button asChild size='lg' className='gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]'>
            <Link href='/sign-in'>
              Sign in
              <ArrowRight className='size-4' />
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg' className='transition-transform hover:scale-[1.02] active:scale-[0.98]'>
            <Link href='/sign-up'>Create account</Link>
          </Button>
        </div>
      </section>

      <Reveal>
        <div className='grid gap-4 sm:grid-cols-3'>
          {[
            { label: 'Private by default', value: 'Your data' },
            { label: 'One total', value: 'Net worth' },
            { label: 'Always current', value: 'Last updated' },
          ].map((s) => (
            <div
              key={s.label}
              className='rounded-xl border border-border bg-muted/30 px-5 py-4 text-center transition-colors hover:border-primary/25 hover:bg-muted/50'
            >
              <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                {s.label}
              </p>
              <p className='mt-1 text-lg font-semibold text-foreground'>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <section>
        <Reveal>
          <div className='text-center'>
            <h2 className='text-lg font-semibold text-foreground sm:text-xl'>
              What you can do
            </h2>
            <p className='mx-auto mt-2 max-w-md text-sm text-muted-foreground'>
              Built for a clear, single-user view of holdings and net worth over
              time.
            </p>
          </div>
        </Reveal>
        <ul className='mt-10 grid gap-6 sm:grid-cols-3'>
          {[
            {
              icon: Wallet,
              title: 'Track assets',
              body: 'Record positions and values so everything rolls up into one picture.',
            },
            {
              icon: LineChart,
              title: 'Net worth',
              body: 'Totals and last-updated timestamps stay visible on the dashboard.',
            },
            {
              icon: Landmark,
              title: 'Base currency',
              body: 'Work in the currency that matters for consistent comparisons.',
            },
          ].map((item, i) => (
            <Reveal key={item.title} delayMs={i * 90}>
              <li className='group h-full rounded-xl border border-border bg-background p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md'>
                <item.icon
                  className='size-9 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:text-primary'
                  aria-hidden
                />
                <h3 className='mt-4 font-medium text-foreground'>{item.title}</h3>
                <p className='mt-2 text-sm text-muted-foreground'>{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className='grid items-center gap-10 lg:grid-cols-2 lg:gap-14'>
        <Reveal>
          <div>
            <div className='inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground'>
              <Sparkles className='size-3.5 text-primary' aria-hidden />
              Snapshot
            </div>
            <h2 className='mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
              A dashboard that stays easy to read
            </h2>
            <p className='mt-3 text-muted-foreground'>
              Tables for detail, a bold total up top, and room to grow as you
              add more asset types. No clutter—just the numbers you check most
              often.
            </p>
            <ul className='mt-6 space-y-3 text-sm text-muted-foreground'>
              <li className='flex gap-2'>
                <PieChart className='mt-0.5 size-4 shrink-0 text-primary' aria-hidden />
                Break down what you own without losing the big picture.
              </li>
              <li className='flex gap-2'>
                <ShieldCheck className='mt-0.5 size-4 shrink-0 text-primary' aria-hidden />
                Signed-in sessions only; your dashboard is not shared.
              </li>
            </ul>
          </div>
        </Reveal>
        <Reveal delayMs={120}>
          <div className='relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-lg'>
            <div className='absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent' />
            <div className='flex items-center justify-between border-b border-border/80 pb-3'>
              <span className='text-xs font-medium text-muted-foreground'>
                Portfolio (illustrative)
              </span>
              <span className='rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                Live view after sign-in
              </span>
            </div>
            <PreviewChart />
            <p className='mt-2 text-center text-[11px] text-muted-foreground'>
              Animated preview—not your actual data.
            </p>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <div className='rounded-2xl border border-border bg-muted/20 px-6 py-10 sm:px-10'>
          <h2 className='text-center text-lg font-semibold text-foreground sm:text-xl'>
            How it works
          </h2>
          <ol className='mx-auto mt-8 grid max-w-3xl gap-8 sm:grid-cols-3 sm:gap-6'>
            {[
              {
                step: '1',
                title: 'Create an account',
                body: 'Sign up with Clerk in a few seconds—no spreadsheets required.',
              },
              {
                step: '2',
                title: 'Add your assets',
                body: 'Log cash, investments, or anything you want in your total.',
              },
              {
                step: '3',
                title: 'Check in anytime',
                body: 'Open the dashboard for an at-a-glance net worth readout.',
              },
            ].map((row, i) => (
              <li key={row.step} className='relative text-center sm:text-left'>
                {i < 2 && (
                  <div
                    className='absolute top-8 left-[calc(50%+1.25rem)] hidden h-px w-[calc(100%-2.5rem)] bg-linear-to-r from-primary/50 to-transparent sm:block lg:left-[calc(100%-0.5rem)] lg:w-[calc(100%-2rem)]'
                    aria-hidden
                  />
                )}
                <div className='mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-background text-sm font-bold text-primary transition-transform duration-300 hover:scale-110 sm:mx-0'>
                  {row.step}
                </div>
                <h3 className='mt-4 font-medium text-foreground'>{row.title}</h3>
                <p className='mt-2 text-sm text-muted-foreground'>{row.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal>
        <div className='flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-background/50 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left'>
          <div className='flex max-w-lg flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-4'>
            <Lock className='size-8 shrink-0 text-primary' aria-hidden />
            <div>
              <h2 className='font-semibold text-foreground'>Security note</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Authentication is handled by Clerk. Treat this app as a personal
                workspace—never share credentials, and use a strong password or
                passkey where available.
              </p>
            </div>
          </div>
          <Button asChild variant='outline' className='shrink-0'>
            <Link href='/sign-up'>Get started</Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
