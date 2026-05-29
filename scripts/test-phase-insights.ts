/**
 * Quick local check for phase insight rotation (no auth).
 * Run: npx tsx scripts/test-phase-insights.ts
 * Optional date: npx tsx scripts/test-phase-insights.ts 2026-05-28
 */
import { calculateHerCyclePhase } from "../src/lib/her-cycle-phase";
import { getDailyPhaseInsight } from "../src/lib/phase-insights";

const refDate = process.argv[2]
  ? new Date(`${process.argv[2]}T12:00:00`)
  : new Date();
const lastPeriod = new Date(refDate);
lastPeriod.setDate(refDate.getDate() - 20);
const iso = lastPeriod.toISOString().slice(0, 10);

const phase = calculateHerCyclePhase(iso, 28, refDate);
const insight = getDailyPhaseInsight(iso, 28, refDate);

console.log("\n--- Phase insights (local) ---");
console.log("Reference date:", refDate.toISOString().slice(0, 10));
console.log("Last period (sample):", iso);
console.log("Phase:", phase?.label, "| Day", phase?.dayInCycle, "|", phase?.id);
console.log("\nPartner insight:\n ", insight?.partner);
console.log("\nHer affirmation:\n ", insight?.her);
console.log("\nSame calendar day → same strings. Next day → rotates.\n");
