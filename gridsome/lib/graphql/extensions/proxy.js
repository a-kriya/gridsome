import { defaultFieldResolver } from 'graphql-compose/lib/graphql.js'
import { get } from 'lodash'
export const description = 'Return value from another field.'
export const args = {
  from: 'String'
}

export function apply(ext, config) {
  if (typeof ext.from !== 'string')
    return
  const resolve = config.resolve || defaultFieldResolver
  const fromPath = ext.from.split('.') // only supporting dot notation for now
  return {
    resolve(source, args, context, info) {
      const fieldName = `__${ext.from}__`
      const fieldValue = get(source, fromPath)
      const newSource = { ...source, [fieldName]: fieldValue }
      const newInfo = { ...info, fieldName }
      return resolve(newSource, args, context, newInfo)
    }
  }
}

export default {
  description,
  args,
  apply
}
