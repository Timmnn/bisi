import { Pkg, Service, type Config } from '../../src/config_utils'
import { pkg } from './utils'

export default {
  packages: [pkg('plasma')] satisfies Config['packages'],
  services: [
    new Service({ name: 'sddm.service' }),
  ] satisfies Config['services'],
}
