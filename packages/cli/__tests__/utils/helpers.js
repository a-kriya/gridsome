import { execa } from 'execa'
const CLI_PATH = require.resolve('../../bin/gridsome')

const runCLI = (args, options = {}) => {
  return execa(CLI_PATH, args, options)
}

export default runCLI
