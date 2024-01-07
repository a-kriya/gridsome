import * as graphql from 'graphql'
import * as graphqlCompose from 'graphql-compose'
const { GraphQLJSON } = graphqlCompose
export { GraphQLJSON }
export default {
  ...graphql,
  GraphQLJSON
}
