import { template } from 'lodash'

function createHTMLRenderer(htmlTemplate) {
  const render = template(htmlTemplate)

  return variables => {
    return render(Object.assign({
      htmlAttrs: '',
      bodyAttrs: '',
      head: '',
      title: '',
      base: '',
      hash: '',
      vueMetaTags: '',
      vueMetaLinks: '',
      resourceHints: '',
      styles: '',
      vueMetaStyles: '',
      vueMetaScripts: '',
      noscript: '',
      app: '',
      scripts: ''
    }, variables))
  }
}

export default createHTMLRenderer
