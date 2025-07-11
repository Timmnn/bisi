import { pkg } from './utils'
import { Config, Pkg } from '../../src/config_utils'
import niri from './modules/niri'
import neovim from './modules/neovim'
import kitty from './modules/kitty'

export default new Config({
  packages: [
    //add virt-viewer
    //add pipewire
    //sudo pacman -S --noconfirm pipewire pipewire-alsa pipewire-jack wireplumber
    //add pwvucontrol
    //systemctl --user enable pipewire.socket
    //systemctl --user enable wireplumber.service
    pkg('extra/code'),
    new Pkg({
      name: 'bun',
      custom_install_script: `curl -fsSL https://bun.sh/install | bash`,
      dependencies: [pkg('extra/unzip')],
    }),
  ],
})
  .merge(niri)
  .merge(neovim)
  .merge(kitty)
