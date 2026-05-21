# Lovira v0.2

Local-first couple wellness prototype (no login, no database, no API).

## Routes

- `/` — Landing page
- `/dashboard` — v0.2 dashboard

## Dashboard (5 steps)

1. **Period start date** — `PeriodDateForm` → `lovira:lastPeriodStart`
2. **Cycle day + phase** — `lib/cycle.ts` (Menstrual / Follicular / Ovulation / Luteal)
3. **Mood check-in** — emoji buttons → `lovira:moodLog` (by date)
4. **localStorage** — `lib/storage.ts` (automatic on change)
5. **Partner support card** — `lib/support-tips.ts` (phase + mood)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
