import path from 'path'
import { Config, Pkg } from '../../../src/config_utils'

export default new Config({
  packages: [
    new Pkg({
      name: 'extra/kitty',
      config: {
        src: path.join(__dirname, '../pkg_configs/kitty/'),
        target: '~/.config/kitty',
      },
    }),
  ],
})
