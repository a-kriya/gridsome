import { NOT_FOUND_NAME, NOT_FOUND_PATH } from '../../utils/constants.js'

function genConstants() {
  let code = ''
  code += `export const NOT_FOUND_NAME = ${JSON.stringify(NOT_FOUND_NAME)}\n`
  code += `export const NOT_FOUND_PATH = ${JSON.stringify(NOT_FOUND_PATH)}\n`
  return code
}

export default genConstants
