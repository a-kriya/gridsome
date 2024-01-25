import * as asserts from './asserts.js'
import * as checks from './checks.js'
import * as config from './configstore.js'
import * as install from './install.js'

export { config }

export default {
  ...asserts,
  ...checks,
  ...install,
  config
}
