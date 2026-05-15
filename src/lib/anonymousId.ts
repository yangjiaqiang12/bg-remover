let cachedId: string | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("bg-remover", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("state");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getStoredId(): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction("state", "readonly");
      const req = tx.objectStore("state").get("anonymous_id");
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function storeId(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("state", "readwrite");
    tx.objectStore("state").put(id, "anonymous_id");
  } catch {
    // IndexedDB unavailable, use memory only
  }
}

export async function getAnonymousId(): Promise<string> {
  if (cachedId) return cachedId;

  let id = await getStoredId();
  if (!id) {
    id = crypto.randomUUID();
    await storeId(id);
  }

  cachedId = id;
  return id;
}
