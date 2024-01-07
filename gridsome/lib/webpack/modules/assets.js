import isUrl from 'is-url'
import camelcase from 'camelcase'
import isRelative from 'is-relative'
import { isMailtoLink, isTelLink } from '../../utils/index.js'

function transformNodeAttr(node, attrName, type) {
  if (!Array.isArray(node.attrs))
    return

  for (const attr of node.attrs) {
    if (attr.name === attrName) {
      if (isStatic(attr.value)) {
        attr.value = transformAttrValue(node, attr, type)
        break
      }
    }
  }
}

function transformAttrValue(node, attr, type) {
  const value = extractValue(attr.value)
  let result = attr.value

  if (!isUrl(value) && !isMailtoLink(value) && !isTelLink(value) && isRelative(value)) {
    result = `require("${value}?${type}&${createOptionsQuery(node.attrs)}")`
  }

  return result
}

function isStatic(value) {
  return value[0] === '"' && value[value.length - 1] === '"'
}

function extractValue(value) {
  return value.substr(1, value.length - 2) || true
}

function createOptionsQuery(attrs) {
  return attrs
    .filter(attr => attr.name !== 'src')
    .filter(attr => isStatic(attr.value))
    .map(attr => ({ name: camelcase(attr.name), value: extractValue(attr.value) }))
    .map(attr => `${attr.name}=${encodeURIComponent(attr.value)}`)
    .join('&')
}

export default () => ({
  postTransformNode(node) {
    if (['GLink', 'g-link'].includes(node.tag)) {
      transformNodeAttr(node, 'to', 'g-link')
    }

    if (['GImage', 'g-image'].includes(node.tag)) {
      transformNodeAttr(node, 'src', 'g-image')
    }
  }
})
