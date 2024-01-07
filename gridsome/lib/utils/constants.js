export const NORMAL_PLUGIN = 'plugin'
export const SOURCE_PLUGIN = 'source'
export const TRANSFORMER_PLUGIN = 'transformer'
export const NOT_FOUND_NAME = '404'
export const NOT_FOUND_PATH = '/404'
export const SUPPORTED_IMAGE_TYPES = ['.png', '.jpeg', '.jpg', '.gif', '.svg', '.webp']
export const BOOTSTRAP_CONFIG = 0
export const BOOTSTRAP_SOURCES = 1
export const BOOTSTRAP_GRAPHQL = 2
export const BOOTSTRAP_PAGES = 3
export const BOOTSTRAP_CODE = 4
export const BOOTSTRAP_FULL = Number.MAX_SAFE_INTEGER
export const internalRE = /^internal:\/\//
export const transformerRE = /(?:gridsome[/-]|\/)transformer-([\w-]+)/
export const NODE_FIELDS = ['$uid', '$loki', 'internal', 'id']
export const SORT_ORDER = 'DESC'
export const PER_PAGE = 25
export const SUPPORTED_DATE_FORMATS = [
  // ISO8601
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
export default {
  NORMAL_PLUGIN,
  SOURCE_PLUGIN,
  TRANSFORMER_PLUGIN,
  NOT_FOUND_NAME,
  NOT_FOUND_PATH,
  SUPPORTED_IMAGE_TYPES,
  BOOTSTRAP_CONFIG,
  BOOTSTRAP_SOURCES,
  BOOTSTRAP_GRAPHQL,
  BOOTSTRAP_PAGES,
  BOOTSTRAP_CODE,
  BOOTSTRAP_FULL,
  internalRE,
  transformerRE,
  NODE_FIELDS,
  SORT_ORDER,
  PER_PAGE,
  SUPPORTED_DATE_FORMATS
}
