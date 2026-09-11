/**
 * Deterministic, seeded "engagement" numbers for demo purposes — there's no
 * real analytics pipeline in this MVP. Seeded by post id so the same post
 * always reports the same numbers rather than reshuffling on every render.
 */
function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function simulatedViews(postId: string): number {
  const rand = mulberry32(hashString(`${postId}:views`))
  return Math.round(150 + rand() * 4500)
}

export function simulatedBounceRate(postId: string): number {
  const rand = mulberry32(hashString(`${postId}:bounce`))
  return Math.round((20 + rand() * 45) * 10) / 10
}
