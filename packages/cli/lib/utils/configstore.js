import chalk from 'chalk'
import Configstore from 'configstore'
const config = new Configstore('gridsome', {}, {
  globalConfigPath: true
})

/**
 * @param {string} packageManager
 */
function setPackageManager(packageManager) {
  const available = ['npm', 'yarn', 'pnpm']

  if (packageManager !== 'none' && !available.includes(packageManager)) {
    return (console.log(chalk.red(`Unsupported package manager: ${chalk.bold(packageManager)}`)),
    console.log(),
    console.log(`  Supported package managers are: ${available.map(value => chalk.bold(value)).join(', ')}`),
    console.log(),
    console.log(`  Disable auto-installing by running:`),
    console.log(`  $ ${chalk.green.bold('gridsome config --set packageManager none')}`),
    console.log())
  }

  config.set('packageManager', packageManager)

  if (packageManager !== 'none') {
    console.log(`From now on, ${chalk.bold(packageManager)} will install dependencies automatically.`)
  }
  else {
    console.log(`Gridsome will not install dependencies automatically.`)
  }
}

export const all = config.all || {}
export const path = config.path

export const set = (key, value) => {
  switch (key) {
    case 'packageManager': return setPackageManager(value)
  }

  console.log(`Unknown option: ${chalk.bold(key)}`)
}

export const has = (key) => {
  return config.has(key)
}

export const get = (key) => {
  return config.get(key)
}

const delete$0 = (key) => {
  return config.delete(key)
}

export { delete$0 as delete }
