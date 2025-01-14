const camelCase = require('camelcase')
const { pickBy, isObject, isPlainObject } = require('lodash')

const {
  ThunkComposer,
  UnionTypeComposer,
  ObjectTypeComposer
} = require('graphql-compose')

const CreatedGraphQLType = {
  Enum: 'Enum',
  Object: 'Object',
  Union: 'Union',
  Scalar: 'Scalar',
  Interface: 'Interface',
  Input: 'Input'
}

const ReservedTypeNames = ['Page', 'Node']
const ReservedScalarNames = ['Boolean', 'Date', 'File', 'Float', 'ID', 'Image', 'Int', 'JSON', 'String']
const ReservedRules = {
  'FilterInput$': `Type name cannot end with 'FilterInput'.`,
  'QueryOperatorInput$': `Type name cannot end with 'QueryOperatorInput'`,
  '^Metadata[A-Z]': `Type name cannot start with 'Metadata'`,
  '^Node[A-Z]': `Type name cannot start with 'Node'`
}

exports.validateTypeName = function (typeName) {
  if (ReservedTypeNames.includes(typeName)) {
    throw new Error(`'${typeName}' is a reserved type name.`)
  }

  if (ReservedScalarNames.includes(typeName)) {
    throw new Error(`'${typeName}' is a reserved scalar type.`)
  }

  for (const rule in ReservedRules) {
    if (new RegExp(rule).test(typeName)) {
      throw new Error(ReservedRules[rule])
    }
  }
}

exports.createQueryVariables = function (path, variables, currentPage = undefined) {
  return pickBy(
    { ...variables, page: currentPage, __path: path },
    value => value !== undefined
  )
}

exports.is32BitInt = function (x) {
  return (x | 0) === x
}

exports.CreatedGraphQLType = CreatedGraphQLType

exports.isRefFieldDefinition = function (field) {
  return (
    isPlainObject(field) &&
    Object.keys(field).length === 2 &&
    Object.hasOwn(field, 'typeName') &&
    Object.hasOwn(field, 'isList')
  )
}

exports.isCreatedType = function (value) {
  return isObject(value) && Object.hasOwn(CreatedGraphQLType, value.type)
}

exports.createEnumType = options => ({ options, type: CreatedGraphQLType.Enum })
exports.createObjectType = options => ({ options, type: CreatedGraphQLType.Object })
exports.createUnionType = options => ({ options, type: CreatedGraphQLType.Union })
exports.createInterfaceType = options => ({ options, type: CreatedGraphQLType.Interface })
exports.createScalarType = options => ({ options, type: CreatedGraphQLType.Scalar })
exports.createInputType = options => ({ options, type: CreatedGraphQLType.Input })

exports.isEnumType = value => isObject(value) && value.type === CreatedGraphQLType.Enum
exports.isObjectType = value => isObject(value) && value.type === CreatedGraphQLType.Object
exports.isUnionType = value => isObject(value) && value.type === CreatedGraphQLType.Union
exports.isInterfaceType = value => isObject(value) && value.type === CreatedGraphQLType.Interface
exports.isScalarType = value => isObject(value) && value.type === CreatedGraphQLType.Scalar
exports.isInputType = value => isObject(value) && value.type === CreatedGraphQLType.Input

const typeNameCounter = {}

exports.createTypeName = function (typeName, suffix = '') {
  suffix = camelCase(suffix, { pascalCase: true })

  let name = suffix ? `${typeName}_${suffix}` : typeName

  if (typeNameCounter[name]) {
    typeNameCounter[name]++
    name += typeNameCounter[name]
  } else {
    typeNameCounter[name] = 1
  }

  return name
}

exports.hasNodeReference = function (typeComposer) {
  switch (typeComposer.constructor) {
    case ObjectTypeComposer:
      return typeComposer.hasInterface('Node')
    case UnionTypeComposer:
      return typeComposer.getTypes().some(type => {
        const typeComposer = type instanceof ThunkComposer
          ? type.getUnwrappedTC()
          : type

        return typeComposer instanceof ObjectTypeComposer
          ? typeComposer.hasInterface('Node')
          : false
      })
    default:
      return false
  }
}
