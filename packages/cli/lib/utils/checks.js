import { execa } from 'execa'
import semver from 'semver'

export const hasYarn = async function () {
  try {
    const { stdout: version } = await execa('yarn', ['--version'])
    return semver.satisfies(version, '>= 1.4.0', { includePrerelease: true })
  }
  catch (err) { /* empty */ }

  return false
}

export const hasPnpm = async function () {
  try {
    const { stdout: version } = await execa('pnpm', ['--version'])
    return semver.satisfies(version, '>= 5.9.3', { includePrerelease: true })
  }
  catch (err) { /* empty */ }

  return false
}
