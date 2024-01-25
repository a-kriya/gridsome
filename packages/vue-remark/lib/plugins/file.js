import path from 'path'
import isUrl from 'is-url'
import isRelative from 'is-relative'
import visit from 'unist-util-visit'
export default (function attacher(options = {}) {
  return function transform(tree) {
    visit(tree, 'link', node => {
      if (!isUrl(node.url) &&
                isRelative(node.url) &&
                path.extname(node.url) &&
                options.processFiles !== false &&
                !/^mailto:/.test(node.url)) {
        node.type = 'g-link'
      }
    })
  }
})
