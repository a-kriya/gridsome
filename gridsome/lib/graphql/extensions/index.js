const { GraphQLDirective, DirectiveLocation, defaultFieldResolver } = require('graphql')

const objectExtensions = {
  infer: {
    description: 'Add fields from field values.'
  }
}

const fieldExtensions = {
  reference: require('./reference'),
  proxy: require('./proxy')
}

// TODO: validate allowed field types for custom extensions
function addDirectives (schemaComposer, customExtensions = {}) {
  const { OBJECT, FIELD_DEFINITION } = DirectiveLocation

  for (const key in customExtensions) {
    if (fieldExtensions[key]) {
      throw new Error(`Cannot add the '${key}' extension because it already exist.`)
    }
  }

  const allFieldExtensions = {
    ...customExtensions,
    ...fieldExtensions
  }

  addExtensionDirectives(schemaComposer, objectExtensions, OBJECT)
  addExtensionDirectives(schemaComposer, allFieldExtensions, FIELD_DEFINITION)
}

function addExtensionDirectives (schemaComposer, extensions, location) {
  for (const name in extensions) {
    const extension = extensions[name]

    const directive = new GraphQLDirective({
      name,
      description: extension.description,
      locations: [location],
      args: normalizeArgs(schemaComposer, extension.args)
    })

    schemaComposer.addDirective(directive)
  }
}

function normalizeArgs (schemaComposer, args = {}) {
  const res = {}

  for (const key in args) {
    const value = args[key]
    const config = typeof value === 'string'
      ? { type: value }
      : value

    if (typeof config.type === 'string') {
      config.type = schemaComposer.typeMapper
        .getBuiltInType(config.type)
        .getType()
    }

    res[key] = config
  }

  return res
}

function applyFieldExtensions (typeComposer, customExtensions = {}) {
  const allFieldExtensions = {
    ...customExtensions,
    ...fieldExtensions
  }

  typeComposer.getFieldNames().forEach(fieldName => {
    const directives = typeComposer
      .getFieldDirectives(fieldName)
      .filter(({ name }) => Object.hasOwn(allFieldExtensions, name))

    directives.forEach(({ name, args }) => {
      const { apply } = allFieldExtensions[name] || {}

      if (typeof apply === 'function') {
        const fieldConfig = typeComposer.getFieldConfig(fieldName)
        const resolve = fieldConfig.resolve || defaultFieldResolver
        const newFieldConfig = apply(args, { ...fieldConfig, resolve }, {
          typeComposer,
          fieldName
        })

        if (newFieldConfig) {
          typeComposer.extendField(fieldName, newFieldConfig)
        }
      }
    })
  })
}

module.exports = {
  addDirectives,
  applyFieldExtensions
}
