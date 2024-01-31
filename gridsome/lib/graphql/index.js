import graphql from 'graphql-compose/lib/graphql.js'
import parseQuery from './parseQuery.js'
import createSchema from './createSchema.js'
import { GraphQLJSON } from 'graphql-compose'
import { toFilterArgs } from './filters/query.js'
import { createBelongsToKey } from './nodes/belongsTo.js'
import { createPagedNodeEdges } from './nodes/utils.js'

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
