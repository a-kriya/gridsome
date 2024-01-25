import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import graphql from '@kriya/gridsome/graphql'

const { GraphQLScalarType } = graphql
const ContentfulRichTextField = new GraphQLScalarType({
  name: 'ContentfulRichTextField',
  serialize: value => value
})

export default options => ({
  type: ContentfulRichTextField,
  args: {
    html: { type: 'Boolean', defaultValue: false }
  },
  resolve(obj, args, context, info) {
    const value = obj[info.fieldName]

    const json = typeof value === 'string'
      ? JSON.parse(value)
      : null

    return args.html
      ? documentToHtmlString(json, options.richText)
      : json
  }
})
