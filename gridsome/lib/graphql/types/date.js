import moment from 'moment'
import { Kind } from 'graphql'
import { SUPPORTED_DATE_FORMATS } from '../../utils/constants.js'

function formatDate(value, args = {}) {
  if (Object.keys(args).length) {
    const { format, locale = 'en' } = args
    return moment
      .utc(toString(value), SUPPORTED_DATE_FORMATS, true)
      .locale(locale)
      .format(format)
  }

  return toString(value)
}

function toString(value) {
  return typeof value === 'number'
    ? new Date(value).toISOString()
    : typeof value === 'object'
      ? value.toISOString()
      : value
}

export const isDate = value => {
  const date = moment.utc(value, SUPPORTED_DATE_FORMATS, true)
  return date.isValid() && typeof value !== 'number'
}

export const createDateScalar = schemaComposer => {
  return schemaComposer.createScalarTC({
    name: 'Date',
    serialize: String,
    parseValue: String,
    parseLiteral(ast) {
      return ast.kind === Kind.STRING ? ast.value : undefined
    }
  })
}

export const dateType = {
  type: 'Date',
  args: {
    format: { type: 'String', description: 'Date format' },
    locale: { type: 'String', description: 'Locale' }
  },
  resolve: (obj, args, context, { fieldName }) => {
    return obj[fieldName] ? formatDate(obj[fieldName], args) : null
  }
}
