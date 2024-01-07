import { LRUCache } from 'lru-cache'
import crypto from 'crypto'
const cache = new LRUCache({ max: 1000 })

const cache$0 = (cacheKey, fallback) => {
  let result = cache.get(cacheKey)

  if (!result) {
    cache.set(cacheKey, (result = fallback()))
  }

  return Promise.resolve(result)
}

export const nodeCache = (node, key, fallback) => {
  const { $loki, fields, internal } = node
  const string = JSON.stringify({ $loki, fields, internal })
  const hash = crypto.createHash('md5').update(string).digest('hex')
  const cacheKey = `${$loki}-${hash}-${key}`
  let result = cache.get(cacheKey)

  if (!result) {
    cache.set(cacheKey, (result = fallback()))
  }

  return Promise.resolve(result)
}

export { cache$0 as cache }
