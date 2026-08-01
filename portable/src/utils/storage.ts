export function setStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);

  if (value === null)
    return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    localStorage.removeItem(key);
  }

  return null;
}

export function checkStorage(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

export function removeStorage(key: string): void {
  localStorage.removeItem(key);
}

export function clearStorage(): void {
  localStorage.clear();
}

