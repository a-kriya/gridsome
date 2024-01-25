#!/usr/bin/env node
import path from 'path'
import chalk from 'chalk'
import program from 'commander'
import { distance } from 'fastest-levenshtein'
import importSync from 'import-sync'
import resolveCwd from 'resolve-cwd'
import updateNotifier from 'update-notifier'
import resolveVersions from '../lib/utils/version.js'
import findUp from 'find-up'
import create from '../lib/commands/create.js'
import config from '../lib/commands/config.js'
import info from '../lib/commands/info.js'
import utils from '../lib/utils/index.js'

const pkg = importSync('../package.json')
const pkgPath = findUp.sync('package.json')
const notifier = updateNotifier({ pkg })

const context = pkgPath ? path.resolve(path.dirname(pkgPath)) : process.cwd()
const version = resolveVersions(pkgPath)

program
  .version(version, '-v, --version')
  .usage('<command> [options]')

program
  .command('create <name> [starter]')
  .description('create a new website')
  .action((...args) => {
    return wrapCommand(create)(...args)
  })

try {
  const gridsomePath = resolveCwd.silent('@kriya/gridsome')
  importSync(gridsomePath).default({ context, program })
}
catch (err) {
  console.log(err)
}

program
  .command('config [value]')
  .option('-g, --get <key>', 'get option value')
  .option('-s, --set <key> <value>', 'set option value')
  .option('-d, --delete <key>', 'delete an option')
  .option('--json', 'output all options as JSON')
  .description('inspect or set config')
  .action((...args) => {
    return wrapCommand(config)(...args)
  })

program
  .command('info')
  .description('output information about the local environment')
  .action(() => {
    return wrapCommand(info)()
  })
// show a warning if the command does not exist
program.arguments('<command>').action(async (command) => {
  const availableCommands = program.commands.map(cmd => cmd._name)
  const suggestion = availableCommands.find(cmd => {
    const steps = distance(cmd, command)
    return steps < 3
  })

  console.log(chalk.red(`Unknown command ${command}`))

  if (utils.isGridsomeProject(pkgPath) && !suggestion) {
    console.log()
    console.log()
    program.outputHelp()
  }
  else if (suggestion) {
    console.log()
    console.log(`Did you mean ${suggestion}?`)
  }
})

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan('gridsome <command> --help')} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

if (notifier.update) {
  (async () => {
    console.log()
    console.log(`${chalk.bgGreen(' ')} Update available: ${chalk.bold(notifier.update.latest)}`)
    console.log()
  })()
}

function wrapCommand(fn) {
  return (...args) => {
    return fn(...args).catch(err => {
      console.error(chalk.red(err.stack))
      process.exitCode = 1
    })
  }
}
