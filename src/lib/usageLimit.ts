const STORAGE_KEY = "bg-remover-usage";
const DAILY_LIMIT = 3;

interface UsageData {
  date: string;
  count: number;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getUsage(): UsageData {
  if (typeof window === "undefined") return { date: getToday(), count: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getToday(), count: 0 };
    const data: UsageData = JSON.parse(raw);
    if (data.date !== getToday()) return { date: getToday(), count: 0 };
    return data;
  } catch {
    return { date: getToday(), count: 0 };
  }
}

function saveUsage(data: UsageData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getRemainingUses(): number {
  const usage = getUsage();
  return Math.max(0, DAILY_LIMIT - usage.count);
}

export function canUse(): boolean {
  return getRemainingUses() > 0;
}

export function recordUse(): void {
  const usage = getUsage();
  usage.count += 1;
  saveUsage(usage);
}
