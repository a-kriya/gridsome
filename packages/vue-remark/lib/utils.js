import path from 'path'
import moment from 'moment'
import lodash from 'lodash'
import importSync from 'import-sync'
import packageJson from '../package.json'

const { isPlainObject, get } = lodash

const SUPPORTED_DATE_FORMATS = [
  'YYYY',
  'YYYY-MM',
  'YYYY-MM-DD',
  'YYYYMMDD',

  // Local Time
  'YYYY-MM-DDTHH',
  'YYYY-MM-DDTHH:mm',
  'YYYY-MM-DDTHHmm',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHHmmss',
  'YYYY-MM-DDTHH:mm:ss.SSS',
  'YYYY-MM-DDTHHmmss.SSS',

  // Coordinated Universal Time (UTC)
  'YYYY-MM-DDTHHZ',
  'YYYY-MM-DDTHH:mmZ',
  'YYYY-MM-DDTHHmmZ',
  'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHHmmssZ',
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'YYYY-MM-DDTHHmmss.SSSZ',

  'YYYY-[W]WW',
  'YYYY[W]WW',
  'YYYY-[W]WW-E',
  'YYYY[W]WWE',
  'YYYY-DDDD',
  'YYYYDDDD',

  'YYYY-MM-DD HH:mm:ss Z',
  'YYYY-MM-DD HH:mm:ss',

  'YYYY-MM-DD HH:mm:ss.SSSS Z',
  'YYYY-MM-DD HH:mm:ss.SSSS'
]

export const createFile = function (options) {
  const file = {
    contents: options.contents
  }

  if (options.path) file.path = options.path
  if (options.data) file.data = options.data

  return file
}

export const createCacheIdentifier = function (context, options, attachers = []) {
  const version = packageJson.version
  const pkg = importSync(path.resolve(context, 'package.json'))
  const { dependencies: deps1 = {}, devDependencies: deps2 = {}} = pkg

  const remarkPlugins = Object.keys({ ...deps1, ...deps2 })
    .filter(name => /remark-(?!cli$)/.test(name))
    .map(name => ({
      fn: importSync(name),
      pkg: importSync(`${name}/package.json`)
    }))

  const plugins = attachers
    .map(([fn, options = {}]) => {
      const plugin = remarkPlugins.find(plugin => plugin.fn === fn)

      return plugin && {
        name: plugin.pkg.name,
        version: plugin.pkg.version,
        options
      }
    })
    .filter(Boolean)

  return JSON.stringify({ version, options, plugins })
}

export const normalizeLayout = function (layout) {
  const defaultLayout = require.resolve('../src/VueRemarkRoot.js')

  if (typeof layout === 'string') {
    return { component: layout, props: {} }
  } else if (typeof layout === 'object') {
    return {
      component: layout.component || defaultLayout,
      props: layout.props || {}
    }
  }

  return { component: defaultLayout, props: {} }
}

export const makePathParams = (object, { routeKeys, dateField = 'date' }, slugify) => {
  const date = moment.utc(object[dateField], SUPPORTED_DATE_FORMATS, true)
  const length = routeKeys.length
  const params = {}

  /**
   * Param values are slugified but the original
   * value will be available with '_raw' suffix.
   */
  for (let i = 0; i < length; i++) {
    const { name, fieldName, repeat, suffix } = routeKeys[i]
    const { path: fieldPath } = routeKeys[i]

    const field = get(object, fieldPath, fieldName)

    if (fieldName === 'id') params.id = object.id
    else if (fieldName === 'year' && !object.year) params.year = date.format('YYYY')
    else if (fieldName === 'month' && !object.month) params.month = date.format('MM')
    else if (fieldName === 'day' && !object.day) params.day = date.format('DD')
    else {
      const repeated = repeat && Array.isArray(field)
      const values = repeated ? field : [field]

      const segments = values.map(value => {
        if (
          isPlainObject(value) &&
          Object.hasOwn(value, 'typeName') &&
          Object.hasOwn(value, 'id') &&
          !Array.isArray(value.id)
        ) {
          return String(value.id)
        } else if (!isPlainObject(value)) {
          return suffix === 'raw'
            ? String(value)
            : slugify(String(value))
        } else {
          return ''
        }
      }).filter(Boolean)

      params[name] = repeated ? segments : segments[0]
    }
  }

  return params
}
