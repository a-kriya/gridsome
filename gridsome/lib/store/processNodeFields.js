import lodash from 'lodash'
import { isResolvablePath } from '../utils/index.js'
import { NODE_FIELDS } from '../utils/constants.js'
import { resolvePath } from './utils.js'
const { omit, isDate } = lodash

function processFields(fields = {}, options = {}) {
  const { origin = '', context, resolveAbsolute } = options

  const processField = field => {
    if (field === undefined)
      return field
    if (field === null)
      return field

    switch (typeof field) {
      case 'object':
        if (isDate(field)) {
          return field
        }

        return processFields(field)
      case 'string':
        return isResolvablePath(field)
          ? resolvePath(origin, field, { context, resolveAbsolute })
          : field
    }

    return field
  }

  const processFields = fields => {
    const res = {}

    for (const key in fields) {
      if (key.startsWith('__')) {
        // don't touch keys which starts with __ because they are
        // meant for internal use and will not be part of the schema
        res[key] = fields[key]
        continue
      }

      res[key] = Array.isArray(fields[key])
        ? fields[key].map(value => processField(value))
        : processField(fields[key])
    }

    return res
  }

  return processFields(fields)
}

export default (function processNodeFields(node, collection) {
  const fields = omit(node, NODE_FIELDS)
  const results = processFields(fields, {
    origin: node.internal.origin,
    context: collection._assetsContext,
    resolveAbsolute: collection._resolveAbsolutePaths
  })
  return {
    id: node.id,
    $uid: node.$uid,
    internal: node.internal,
    ...results
  }
})
