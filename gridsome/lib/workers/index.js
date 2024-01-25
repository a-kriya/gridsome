import { createRequire } from 'node:module'
import path from 'path'
import sysinfo from '../utils/sysinfo.js'
import {Worker} from 'jest-worker'
import { getDirname } from 'cross-dirname'

const require = createRequire(import.meta.url)

function createWorker(filename) {
  const filepath = path.join(getDirname(), filename)
  const workerPath = require.resolve(filepath)
  return new Worker(workerPath, {
    numWorkers: sysinfo.cpus.physical,
    forkOptions: {
      stdio: ['pipe', 'pipe', process.stderr, 'ipc']
    }
  })
}

export { createWorker }
