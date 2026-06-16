const store = new Map<string, { data: unknown; ts: number }>()
const TTL = 5 * 60 * 1000 // 5 minutes

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > TTL) { store.delete(key); return null }
  return entry.data as T
}

export function cacheSet(key: string, data: unknown) {
  store.set(key, { data, ts: Date.now() })
}

export function cacheInvalidate(key: string) {
  store.delete(key)
}
