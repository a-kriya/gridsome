import { createRequire } from 'node:module'
import { execa } from 'execa'

const require = createRequire(import.meta.url)
const CLI_PATH = require.resolve('../../bin/gridsome')

const runCLI = (args, options = {}) => {
  return execa(CLI_PATH, args, options)
}

export default runCLI
