export function setStorage<T = unknown>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage<T = unknown>(key: string): T | null {
  const value = localStorage.getItem(key);

  if (value === null)
    return null;

  return JSON.parse(value) as T;
}

export function clearStorage(): void {
  localStorage.clear();
}

