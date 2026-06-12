export const SAVED_DESTINATIONS_KEY = "waypoint.saved.destinations.v1";
export const SAVED_STAYS_KEY = "waypoint.saved.stays.v1";

export function readSavedIds(key: string): Set<string> {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return new Set<string>(
      Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [],
    );
  } catch {
    return new Set<string>();
  }
}

export function writeSavedIds(key: string, ids: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify([...ids]));
}

export function toggleSavedId(key: string, id: string) {
  const ids = readSavedIds(key);

  if (ids.has(id)) {
    ids.delete(id);
  } else {
    ids.add(id);
  }

  writeSavedIds(key, ids);
  return ids.has(id);
}
