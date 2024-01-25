import physical from 'physical-cpu-count'
import os from 'os'

const cpus = os.cpus()

export default {
  cpus: {
    logical: parseInt(process.env.GRIDSOME_CPU_COUNT || cpus.length, 10),
    physical: parseInt(process.env.GRIDSOME_CPU_COUNT || physical || 1, 10)
  }
}
