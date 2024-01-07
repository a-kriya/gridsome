import path from 'path'
import createBaseConfig from './createBaseConfig.js'
import vuessrserverPlugin from './plugins/VueSSRServerPlugin.js'
import { getDirname } from 'cross-dirname'
const resolve = p => path.resolve(getDirname(), p)

export default async (app) => {
  const isProd = process.env.NODE_ENV === 'production'
  const config = createBaseConfig(app, { isProd, isServer: true })
  const { outputDir, serverBundlePath } = app.config
  config.entry('app').add(resolve('../../app/entry.server.js'))
  config.target('node')
  config.externals([/^(vue|vue-router|vue-meta)$/])
  config.devtool('source-map')
  config.optimization.minimize(false)
  config.output.libraryTarget('commonjs2')
  config.performance
    .hints(false)
    .maxEntrypointSize(Infinity)
    .maxAssetSize(Infinity)
  config.plugin('vue-server-renderer')
    .use(vuessrserverPlugin, [{
      filename: path.relative(outputDir, serverBundlePath)
    }])
  return config
}
