import camelCase from 'camelcase'
import lodash from 'lodash'
import * as graphqlCompose from 'graphql-compose'
const { pickBy, isObject, isPlainObject } = lodash
const { ThunkComposer, UnionTypeComposer, ObjectTypeComposer } = graphqlCompose
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
const typeNameCounter = {}

export const validateTypeName = function (typeName) {
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

export const createQueryVariables = function (path, variables, currentPage = undefined) {
  return pickBy({ ...variables, page: currentPage, __path: path }, value => value !== undefined)
}

export const is32BitInt = function (x) {
  return (x | 0) === x
}

export const isRefFieldDefinition = function (field) {
  return (isPlainObject(field) &&
        Object.keys(field).length === 2 &&
        Object.hasOwn(field, 'typeName') &&
        Object.hasOwn(field, 'isList'))
}

export const isCreatedType = function (value) {
  return isObject(value) && Object.hasOwn(CreatedGraphQLType, value.type)
}

export const createEnumType = options => ({ options, type: CreatedGraphQLType.Enum })
export const createObjectType = options => ({ options, type: CreatedGraphQLType.Object })
export const createUnionType = options => ({ options, type: CreatedGraphQLType.Union })
export const createInterfaceType = options => ({ options, type: CreatedGraphQLType.Interface })
export const createScalarType = options => ({ options, type: CreatedGraphQLType.Scalar })
export const createInputType = options => ({ options, type: CreatedGraphQLType.Input })
export const isEnumType = value => isObject(value) && value.type === CreatedGraphQLType.Enum
export const isObjectType = value => isObject(value) && value.type === CreatedGraphQLType.Object
export const isUnionType = value => isObject(value) && value.type === CreatedGraphQLType.Union
export const isInterfaceType = value => isObject(value) && value.type === CreatedGraphQLType.Interface
export const isScalarType = value => isObject(value) && value.type === CreatedGraphQLType.Scalar
export const isInputType = value => isObject(value) && value.type === CreatedGraphQLType.Input

export const createTypeName = function (typeName, suffix = '') {
  suffix = camelCase(suffix, { pascalCase: true })
  let name = suffix ? `${typeName}_${suffix}` : typeName

  if (typeNameCounter[name]) {
    typeNameCounter[name]++
    name += typeNameCounter[name]
  }
  else {
    typeNameCounter[name] = 1
  }

  return name
}

export const hasNodeReference = function (typeComposer) {
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

export { CreatedGraphQLType }
