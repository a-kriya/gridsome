import isUrl from 'is-url'
import isRelative from 'is-relative'
import visit from 'unist-util-visit'
export default (function attacher(options = {}) {
  return function transform(tree) {
    visit(tree, 'image', node => {
      if (options.processImages !== false &&
                isRelative(node.url) &&
                !isUrl(node.url)) {
        const data = node.data = (node.data || {})
        const props = data.hProperties = (data.hProperties || {})
        node.type = 'g-image'
        Object.assign(props, options)
      }
    })
  }
})
