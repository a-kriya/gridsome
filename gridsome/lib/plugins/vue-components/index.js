import { createRequire } from 'node:module'
import path from 'path'
import fs from 'fs-extra'
import * as compiler from 'vue/compiler-sfc'
import { getDirname } from 'cross-dirname'

const require = createRequire(import.meta.url)

class VueComponents {
  static defaultOptions() {
    return {}
  }
  constructor(api) {
    api.transpileDependencies([path.resolve(getDirname(), 'lib', 'loaders')])
    api.chainWebpack(config => {
      this.createGraphQLRule(config, 'page-query', './lib/loaders/page-query')
      this.createGraphQLRule(config, 'static-query', './lib/loaders/static-query')
    })
    api._app.pages.hooks.parseComponent.for('vue')
      .tap('VueComponentsPlugin', (source, { resourcePath }) => {
        const filename = path.parse(resourcePath).name
        const { customBlocks } = compiler.parse({ filename, source })
        const pageQuery = customBlocks.find(block => block.type === 'page-query')

        if (pageQuery && pageQuery.attrs && pageQuery.attrs.src) {
          const queryPath = api._app.compiler._resolveSync(path.dirname(resourcePath), pageQuery.attrs.src)
          return {
            pageQuery: fs.readFileSync(queryPath, 'utf8'),
            watchFiles: [queryPath]
          }
        }

        return {
          pageQuery: pageQuery ? pageQuery.content : null
        }
      })
  }
  createGraphQLRule(config, type, loader) {
    const re = new RegExp(`blockType=(${type})`)
    config.module.rule(type)
      .resourceQuery(re)
      .use('babel-loader')
      .loader(require.resolve('babel-loader'))
      .options({
        presets: [
          require.resolve('@vue/babel-preset-app')
        ]
      })
      .end()
      .use(`${type}-loader`)
      .loader(require.resolve(loader))
  }
}

export default VueComponents
