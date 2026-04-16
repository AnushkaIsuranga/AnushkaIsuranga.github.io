const CACHE_TTL_MS = 1000 * 60 * 10
const MAX_CACHE_ITEMS = 100
const cache = new Map()

const normalizeQuestion = (question = '') =>
  String(question)
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const clearExpired = () => {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (value.expiresAt <= now) {
      cache.delete(key)
    }
  }
}

const trimCache = () => {
  if (cache.size <= MAX_CACHE_ITEMS) {
    return
  }

  const oldestKey = cache.keys().next().value
  if (oldestKey) {
    cache.delete(oldestKey)
  }
}

export function getCached(question) {
  clearExpired()
  const key = normalizeQuestion(question)
  if (!key) {
    return null
  }

  const item = cache.get(key)
  if (!item) {
    return null
  }

  return item.answer
}

export function setCached(question, answer) {
  const key = normalizeQuestion(question)
  if (!key || !answer) {
    return
  }

  cache.set(key, {
    answer,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })
  trimCache()
}

export function clearChatCache() {
  cache.clear()
}

// Aliases kept for readability in callers that prefer explicit cache semantics.
export const getCachedAnswer = getCached
export const storeAnswer = setCached
