#!/usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const program = require('commander')
const { distance } = require('fastest-levenshtein')
const resolveCwd = require('resolve-cwd')
const updateNotifier = require('update-notifier')
const resolveVersions = require('../lib/utils/version')
const pkgPath = require('find-up').sync('package.json')

const pkg = require('../package.json')
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
    const create = require('../lib/commands/create')
    return wrapCommand(create)(...args)
  })

try {
  const commandsPath = resolveCwd.silent('@kriya/gridsome/commands')
  const gridsomePath = resolveCwd.silent('@kriya/gridsome')

  if (commandsPath) {
    require(commandsPath)({ context, program })
  } else if (gridsomePath) {
    require(gridsomePath)({ context, program })
  }
} catch (err) {
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
    const config = require('../lib/commands/config')
    return wrapCommand(config)(...args)
  })

program
  .command('info')
  .description('output information about the local environment')
  .action(() => {
    const info = require('../lib/commands/info')
    return wrapCommand(info)()
  })

// show a warning if the command does not exist
program.arguments('<command>').action(async command => {
  const { isGridsomeProject } = require('../lib/utils')
  const availableCommands = program.commands.map(cmd => cmd._name)
  const suggestion = availableCommands.find(cmd => {
    const steps = distance(cmd, command)
    return steps < 3
  })

  console.log(chalk.red(`Unknown command ${chalk.bold(command)}`))

  if (isGridsomeProject(pkgPath) && !suggestion) {
    console.log()
    console.log()
    program.outputHelp()
  } else if (suggestion) {
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

function wrapCommand (fn) {
  return (...args) => {
    return fn(...args).catch(err => {
      console.error(chalk.red(err.stack))
      process.exitCode = 1
    })
  }
}
