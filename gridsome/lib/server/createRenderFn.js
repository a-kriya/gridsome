import fs from 'fs-extra'
import importSync from 'import-sync'
import chalk from 'chalk'
import createHTMLRenderer from './createHTMLRenderer.js'
import vueServerRenderer from 'vue-server-renderer'
import { error } from '../utils/log.js'
import { getDirname } from 'cross-dirname'

const { createBundleRenderer } = vueServerRenderer

export default (function createRenderFn({ htmlTemplate, clientManifestPath, serverBundlePath, shouldPrefetch, shouldPreload }) {
  const renderHTML = createHTMLRenderer(htmlTemplate)
  const clientManifest = importSync(clientManifestPath)
  const serverBundle = importSync(serverBundlePath)

  const renderer = createBundleRenderer(serverBundle, {
    clientManifest,
    runInNewContext: false,
    shouldPrefetch,
    shouldPreload,
    basedir: getDirname()
  })

  return async function render(page, hash) {
    const pageData = page.dataOutput
      ? await fs.readFile(page.dataOutput, 'utf8')
      : JSON.stringify({ hash })
    const context = {
      path: page.path,
      location: page.location,
      state: JSON.parse(pageData)
    }
    let app = ''

    try {
      app = await renderer.renderToString(context)
    }
    catch (err) {
      const location = page.location.name || page.location.path
      error(chalk.red(`Could not generate HTML for "${location}":`))
      throw err
    }

    const inject = context.meta.inject()
    const htmlAttrs = inject.htmlAttrs.text()
    const bodyAttrs = inject.bodyAttrs.text()
    const pageTitle = inject.title.text()
    const metaBase = inject.base.text()
    const vueMetaTags = inject.meta.text()
    const vueMetaLinks = inject.link.text()
    const styles = context.renderStyles()
    const noscript = inject.noscript.text()
    const vueMetaStyles = inject.style.text()
    const vueMetaScripts = inject.script.text()
    const resourceHints = context.renderResourceHints()
    const head = '' +
            pageTitle +
            metaBase +
            vueMetaTags +
            vueMetaLinks +
            resourceHints +
            styles +
            vueMetaStyles +
            vueMetaScripts +
            noscript

    if (pageData.length > 25000) {
      delete context.state.data
      delete context.state.context
    }

    const renderedState = context.renderState()
    const scripts = '' +
            renderedState +
            context.renderScripts() +
            inject.script.text({ body: true })
    return renderHTML({
      htmlAttrs: `data-html-server-rendered="true" ${htmlAttrs}`,
      bodyAttrs,
      head,
      title: pageTitle,
      base: metaBase,
      vueMetaTags,
      vueMetaLinks,
      resourceHints,
      styles,
      vueMetaStyles,
      vueMetaScripts,
      noscript,
      app,
      scripts
    })
  }
})
