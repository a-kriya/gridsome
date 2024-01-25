import path from 'path'
import fs from 'fs-extra'
import * as stackTrace from 'stack-trace'
import { codeFrameColumns } from '@babel/code-frame'
import develop from './lib/develop.js'
import build from './lib/build.js'

function wrapCommand(fn) {
  return (context, args) => {
    return fn(context, args).catch(err => {
      const callSite = getCallSite(context, err)
      const fileName = callSite ? callSite.getFileName() : null
      const filePath = typeof fileName === 'string'
        ? path.resolve(context, fileName)
        : null

      if (filePath && fs.existsSync(filePath)) {
        const line = callSite.getLineNumber()
        const column = callSite.getColumnNumber() || 0
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const location = { start: { line, column } }
        const codeFrame = codeFrameColumns(fileContent, location, {
          highlightCode: true
        })

        console.log(`${err.name}: ${path.relative(context, filePath)}: ` +
                    `${err.message} (${line}:${column})` +
                    `\n\n${codeFrame}`)
      }
      else {
        console.log(err.stack || err)
      }

      process.exitCode = 1
    })
  }
}

function getCallSite(context, err) {
  return stackTrace.parse(err).find(callSite => {
    const fileName = callSite.getFileName() || ''

    return (fileName.startsWith(context) &&
            !/node_modules/.test(fileName))
  })
}

export default ({ context, program }) => {
  program
    .command('develop')
    .description('start development server')
    .option('-p, --port <port>', 'use specified port (default: 8080)')
    .option('-h, --host <host>', 'use specified host (default: 0.0.0.0)')
    .option('-s, --https', 'enable HTTPS for the dev server')
    .action(args => {
      wrapCommand(develop)(context, args)
    })
  program
    .command('build')
    .description('build site for production')
    .action(() => {
      wrapCommand(build)(context, {})
    })
    // TODO
    // program
    //   .command('serve')
    //   .description('start a production node.js server')
    //   .option('-p, --port <port>', 'use specified port (default: 8080)')
    //   .option('-h, --host <host>', 'use specified host (default: 0.0.0.0)')
    //   .action(args => {
    //     wrapCommand(require('./lib/serve'))(context, args)
    //   })
}
