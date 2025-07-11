import path from 'path'
import { Config, Pkg } from '../../../src/config_utils'

export default new Config({
  packages: [
    new Pkg({
      name: 'extra/niri',
      config: {
        src: path.join(__dirname, '../pkg_configs/niri/'),
        target: '~/.config/niri',
      },
    }),
  ],
})
