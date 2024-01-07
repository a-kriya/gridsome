import path from 'path'
import fs from 'fs-extra'
import genIcons from './icons.js'
import genConfig from './config.js'
import genRoutes from './routes.js'
import genPlugins from './plugins.js'
import genConstants from './constants.js'
import { BOOTSTRAP_FULL } from '../../utils/constants.js'

// TODO: let plugins add generated files
class Codegen {
  constructor(app) {
    this.app = app
    // Do not write files during unit tests.
    if (process.env.GRIDSOME_TEST === 'unit')
      return
    this.files = {
      'icons.js': genIcons,
      'config.js': genConfig,
      'routes.js': genRoutes,
      'constants.js': genConstants,
      'plugins-server.js': () => genPlugins(app, true),
      'plugins-client.js': () => genPlugins(app, false),
      'now.js': () => `export default ${app.store.lastUpdate}`
    }
    const outputDir = app.config.appCacheDir
    fs.ensureDirSync(outputDir)
    fs.emptyDirSync(outputDir)
    app.hooks.bootstrap.tapPromise({
      name: 'GridsomeCodegen',
      label: 'Generate temporary code',
      phase: BOOTSTRAP_FULL
    }, () => this.generate())
  }
  async generate(filename = null, ...args) {
    const outputDir = this.app.config.appCacheDir

    const outputFile = async (filename, ...args) => {
      const filepath = path.join(outputDir, filename)
      const content = await this.files[filename](this.app, ...args)

      if (await fs.exists(filepath)) {
        await fs.remove(filepath)
      }

      await fs.outputFile(filepath, content)
    }

    if (filename) {
      await outputFile(filename, ...args)
    }
    else {
      await fs.remove(outputDir)

      for (const filename in this.files) {
        await outputFile(filename)
      }
    }
  }
}

export default Codegen
