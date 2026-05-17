import { getAnonymousId } from "./anonymousId";

const DAILY_LIMIT = 3;

interface UsageRow {
  user_token: string;
  date: string;
  count: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("bg-remover");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getUsage(token: string): Promise<UsageRow | null> {
  try {
    const db = await openDB();
    if (!db.objectStoreNames.contains("usage")) return null;
    return new Promise((resolve) => {
      const tx = db.transaction("usage", "readonly");
      const req = tx.objectStore("usage").get(token);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function setUsage(token: string, row: UsageRow): Promise<void> {
  const db = await openDB();
  const tx = db.transaction("usage", "readwrite");
  tx.objectStore("usage").put(row);
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getRemainingUses(): Promise<number> {
  const token = await getAnonymousId();
  const row = await getUsage(token);
  if (!row || row.date !== today()) return DAILY_LIMIT;
  return Math.max(0, DAILY_LIMIT - row.count);
}

export async function canUse(): Promise<boolean> {
  const remaining = await getRemainingUses();
  return remaining > 0;
}

export async function recordUse(): Promise<void> {
  const token = await getAnonymousId();
  const t = today();
  const row = await getUsage(token);
  await setUsage(token, {
    user_token: token,
    date: t,
    count: row && row.date === t ? row.count + 1 : 1,
  });
}
