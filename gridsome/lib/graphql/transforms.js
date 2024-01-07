import { Kind } from 'graphql'

const getNamedAstType = node => {
  if (node && node.kind !== Kind.NAMED_TYPE) {
    return getNamedAstType(node.type)
  }

  return node
}

function fixIncorrectVariableUsage(schema, ast, variableDef) {
  const typeNode = getNamedAstType(variableDef)
  const incorrectNodes = []

  if (!typeNode) {
    return incorrectNodes
  }

  return incorrectNodes
}

export { fixIncorrectVariableUsage }
export default {
  fixIncorrectVariableUsage
}
