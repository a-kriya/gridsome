import graphql from '@kriya/gridsome/graphql'
import * as wrap from '@graphql-tools/wrap'
import utils from '@graphql-tools/utils'

const { print, GraphQLNonNull, GraphQLObjectType } = graphql
const { introspectSchema, wrapSchema, RenameTypes } = wrap
const { addTypes, mapSchema, MapperKind, modifyObjectFields } = utils

class WarpQueryType {
  constructor(typeName, fieldName) {
    this.typeName = typeName
    this.fieldName = fieldName
  }

  transformSchema(schema) {
    const config = schema.getQueryType().toConfig()
    const queryType = new GraphQLObjectType({ ...config, name: this.typeName })
    const newSchema = addTypes(schema, [queryType])
    const rootFields = {
      [this.fieldName]: {
        type: new GraphQLNonNull(queryType),
        resolve: () => ({})
      }
    }
    return modifyObjectFields(newSchema, config.name, () => true, rootFields)[0]
  }
}

class StripNonQuery {
  transformSchema(schema) {
    return mapSchema(schema, {
      [MapperKind.MUTATION]() {
        return null
      },
      [MapperKind.SUBSCRIPTION]() {
        return null
      }
    })
  }
}

export default (api, options) => {
  const { url, fieldName, headers, typeName = fieldName } = options

  if (!url) {
    throw new Error('Missing url option.')
  }

  if (!fieldName) {
    throw new Error('Missing fieldName option.')
  }

  async function remoteExecutor({ document, variables }) {
    const query = print(document)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ query, variables })
    })
    return res.json()
  }

  api.createSchema(async ({ addSchema }) => {
    addSchema(wrapSchema({
      schema: await introspectSchema(remoteExecutor),
      executor: remoteExecutor,
      transforms: [
        new StripNonQuery(),
        new WarpQueryType(typeName, fieldName),
        new RenameTypes(name => `${typeName}_${name}`)
      ]
    }))
  })
}
