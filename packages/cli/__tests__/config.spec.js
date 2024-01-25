import { getDirname } from 'cross-dirname'
import runCLI from './utils/helpers.js'

test('warns if unkown option name', async () => {
  const { stdout } = await runCLI(['config', '--set', 'asdf'], { cwd: getDirname() })

  expect(stdout).toBe('Unknown option: asdf')
})

test('warns if unkown package manager', async () => {
  const { stdout } = await runCLI(['config', '--set', 'packageManager', 'asdf'], { cwd: getDirname() })

  expect(stdout).toMatch('Unsupported package manager: asdf')
  expect(stdout).toMatch('gridsome config --set packageManager none')
})
