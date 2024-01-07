import { GraphQLDirective, DirectiveLocation } from 'graphql'
export default new GraphQLDirective({
  name: 'paginate',
  description: 'Paginate a connection in a query. Only supported in page-query.',
  locations: [
    DirectiveLocation.FIELD
  ]
})
