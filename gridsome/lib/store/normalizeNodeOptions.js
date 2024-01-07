import hash from 'hash-sum'
import crypto from 'crypto'
import lodash from 'lodash'
import { NODE_FIELDS } from '../utils/constants.js'
const { pick, omit } = lodash

function genUid(value) {
  return crypto.createHash('md5').update(value).digest('hex')
}

function createInternal(collection, internal = {}) {
  return {
    typeName: collection.typeName,
    origin: internal.origin,
    mimeType: internal.mimeType,
    content: internal.content,
    timestamp: Date.now()
  }
}

export default (function normalizeNodeOptions(options, collection, useFallbacks) {
  if (typeof options === 'string') {
    options = { id: options }
  }

  const nodeOptions = pick(options, NODE_FIELDS)
  const customFields = omit(options, NODE_FIELDS)
  nodeOptions.internal = createInternal(collection, nodeOptions.internal)

  if (typeof nodeOptions.id !== 'undefined' &&
        typeof nodeOptions.id !== 'string') {
    nodeOptions.id = String(nodeOptions.id)
  }

  if (useFallbacks) {
    if (!nodeOptions.id) {
      nodeOptions.id = hash(options)
    }

    if (!nodeOptions.$uid) {
      nodeOptions.$uid = genUid(collection.typeName + nodeOptions.id)
    }
  }

  return { ...customFields, ...nodeOptions }
})
