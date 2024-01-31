import { parse, validate, specifiedRules } from 'graphql-compose/lib/graphql.js'

export default (schema, doc, rules = specifiedRules) => {
  if (typeof doc === 'string') {
    doc = parse(doc)
  }

  return validate(schema, doc, rules)
}
