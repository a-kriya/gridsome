import path from 'path'
import sysinfo from '../utils/sysinfo.js'
import jestWorker from 'jest-worker'
import { getDirname } from 'cross-dirname'

const Worker = jestWorker.default

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
