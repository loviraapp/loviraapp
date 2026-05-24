import { loadCompletedDates } from "@/lib/streak";

export type ConstellationStar = {
  dateKey: string;
  x: number;
  y: number;
};

const MAX_STARS = 14;
const WIDTH = 320;
const HEIGHT = 112;

export function getConstellationStars(): ConstellationStar[] {
  const dates = loadCompletedDates().slice(-MAX_STARS);
  return dates.map((date) => {
    let hash = 0;
    for (let j = 0; j < date.length; j++) {
      hash = (hash + date.charCodeAt(j) * (j + 3)) % 997;
    }
    return {
      dateKey: date,
      x: 32 + (hash % (WIDTH - 64)),
      y: 18 + ((hash * 7) % (HEIGHT - 36)),
    };
  });
}

export function getStarCount(): number {
  return loadCompletedDates().length;
}
