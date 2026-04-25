export function getFromStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}
