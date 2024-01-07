import chalk from 'chalk'
import readline from 'readline'

function log(type, color, message = '', tag = '') {
  const formatted = color ? chalk[color](message) : message
  const fn = console[type]

  if (process.env.GRIDSOME_TEST) {
    return
  }

  tag ? fn(tag, '>', formatted) : fn(formatted)
}

const log$0 = function (message, tag) {
  log('log', null, message, tag)
}

export const info = function (message, tag) {
  log('info', 'dim', message, tag)
}

export const warn = function (message, tag) {
  log('warn', 'yellow', message, tag)
}

export const error = function (message, tag) {
  log('error', 'red', message, tag)
}

export const writeLine = function (message) {
  if (process.env.GRIDSOME_TEST) {
    return
  }

  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0, null)
  process.stdout.write(message)
}

export { log$0 as log }
