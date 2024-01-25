import { LRUCache } from 'lru-cache'
import hash from 'hash-sum'
import { getOptions } from 'loader-utils'

const cache = new LRUCache({ max: 1000 })

export default async function vueRemarkLoader (source, map) {
  const plugin = getOptions(this)
  const cacheKey = hash(source + this.resourcePath)
  const cached = cache.get(cacheKey)
  const callback = this.async()

  let res = null

  if (cached) {
    callback(null, cached, map)
    return
  }

  try {
    res = await plugin.parse(source, { resourcePath: this.resourcePath })
  } catch (err) {
    callback(err, source, map)
    return
  }

  cache.set(cacheKey, res)
  callback(null, res, map)
}
