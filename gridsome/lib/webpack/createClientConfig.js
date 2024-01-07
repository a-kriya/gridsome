import path from 'path'
import createBaseConfig from './createBaseConfig.js'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import { EsbuildPlugin } from 'esbuild-loader'
import providePlugin from 'webpack/lib/ProvidePlugin'
import vuessrclientPlugin from './plugins/VueSSRClientPlugin.js'
import esbuild from 'esbuild'
import noEmitOnErrorsPlugin from 'webpack/lib/NoEmitOnErrorsPlugin'
import friendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'
import { getDirname } from 'cross-dirname'
const resolve = p => path.resolve(getDirname(), p)

export default async (app) => {
  const isProd = process.env.NODE_ENV === 'production'
  const config = createBaseConfig(app, { isProd, isServer: false })
  const { outputDir, clientManifestPath, css } = app.config
  config.entry('app').add(resolve('../../app/entry.client.js'))
  config.resolve.merge({
    fallback: {
      process: require.resolve('process/browser')
    }
  })
  config.plugin('provide')
    .use(providePlugin, [{
      process: require.resolve('process/browser')
    }])

  if (isProd) {
    config.plugin('vue-server-renderer')
      .use(vuessrclientPlugin, [{
        filename: path.relative(outputDir, clientManifestPath)
      }])
    const cacheGroups = {
      vendor: {
        test(mod) {
          if (!mod.context) {
            return true
          }

          if (mod.context.startsWith(app.config.appCacheDir)) {
            return false
          }

          return mod.context.includes('node_modules')
        },
        name: 'vendors',
        chunks: 'all'
      }
    }

    if (css.split !== true) {
      cacheGroups.styles = {
        name: 'styles',
        test: m => /css\/mini-extract/.test(m.type),
        chunks: 'all',
        enforce: true
      }
    }

    config.optimization
      .minimize(true)
      .runtimeChunk('single')
      .splitChunks({ cacheGroups })
      .minimizer('esbuild')
      .use(EsbuildPlugin, [{
        implementation: esbuild
      }])
      .end()
      .minimizer('css-minimizer-webpack-plugin')
      .use(CssMinimizerPlugin)
      .end()
      .merge({ moduleIds: 'deterministic' })
  }
  else {
    config.entry('app').add(resolve('../../app/entry.sockjs.js'))
    config.plugin('no-emit-on-errors')
      .use(noEmitOnErrorsPlugin)
    config.plugin('friendly-errors')
      .use(friendlyErrorsWebpackPlugin)
    config.stats('none') // `@soda/friendly-errors-webpack-plugin` shows the errors
  }

  if (process.env.GRIDSOME_TEST) {
    config.output.pathinfo(true)
    config.optimization.minimize(false)
    config.optimization.merge({ moduleIds: 'named' })
  }

  return config
}
