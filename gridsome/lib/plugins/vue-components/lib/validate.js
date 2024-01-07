import { parse, validate, specifiedRules } from 'graphql'

export default (schema, doc, rules = specifiedRules) => {
  if (typeof doc === 'string') {
    doc = parse(doc)
  }

  return validate(schema, doc, rules)
}
