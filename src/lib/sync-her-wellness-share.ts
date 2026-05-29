import {
  type HerCheckInOption,
  getHerCheckInForDate,
  getHerCycleLength,
  getHerLastPeriod,
  getHerPrivacySetting,
  getTodayKey,
} from "@/lib/her-wellness-storage";
import { calculateHerCyclePhase } from "@/lib/her-cycle-phase";
import { getPartnerInsightForShare } from "@/lib/phase-insights";

export async function syncHerWellnessShareToServer(): Promise<void> {
  const privacy = getHerPrivacySetting();
  const phase = calculateHerCyclePhase(
    getHerLastPeriod(),
    getHerCycleLength()
  );
  const checkIn = getHerCheckInForDate(getTodayKey());

  await fetch("/api/wellness/share", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      privacySetting: privacy,
      phaseLabel: phase?.label ?? null,
      phaseDay: phase?.dayInCycle ?? null,
      phaseDescription:
        getPartnerInsightForShare(
          getHerLastPeriod(),
          getHerCycleLength()
        ) ?? phase?.description ?? null,
      checkInKey: checkIn,
    }),
  });
}
