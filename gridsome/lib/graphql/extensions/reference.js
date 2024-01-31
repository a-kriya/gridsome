import { defaultFieldResolver } from 'graphql-compose/lib/graphql.js'
export const description = 'Add reference resolver.'
export const args = {
  by: {
    type: 'String',
    defaultValue: 'id',
    description: 'Reference node by a custom field value.'
  }
}

export function apply(ext, config, { typeComposer, fieldName }) {
  const resolve = config.resolve || defaultFieldResolver

  if (typeComposer.isFieldPlural(fieldName)) {
    const refTypeComposer = typeComposer.getFieldTC(fieldName)
    const referenceManyAdvanced = refTypeComposer.getResolver('referenceManyAdvanced')
    const resolve = referenceManyAdvanced.getResolve()
    return {
      args: referenceManyAdvanced.getArgs(),
      resolve(source, args, context, info) {
        return resolve({ source, args: { ...args, by: ext.by }, context, info })
      }
    }
  }

  return {
    resolve(source, args, context, info) {
      return resolve(source, { ...args, by: ext.by }, context, info)
    }
  }
}

export default {
  description,
  args,
  apply
}
