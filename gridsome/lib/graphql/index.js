import * as graphql from 'graphql'
import parseQuery from './parseQuery.js'
import createSchema from './createSchema.js'
import * as graphqlCompose from 'graphql-compose'
import { toFilterArgs } from './filters/query.js'
import { createBelongsToKey } from './nodes/belongsTo.js'
import { createPagedNodeEdges } from './nodes/utils.js'
const { GraphQLJSON } = graphqlCompose
export { GraphQLJSON }
export { createSchema }
export { parseQuery }
export { toFilterArgs }
export { createBelongsToKey }
export { createPagedNodeEdges }
export default {
  ...graphql,
  GraphQLJSON,
  createSchema,
  parseQuery,
  toFilterArgs,
  createBelongsToKey,
  createPagedNodeEdges
}
