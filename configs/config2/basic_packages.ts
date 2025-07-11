import { AurHelper, Pkg, type Config } from '../../src/config_utils'
import path from 'path'
import { pkg } from './utils'

export default [
  new Pkg({
    name: 'extra/neovim',
    config: {
      src: path.join(__dirname, 'pkg_configs/neovim'),
      target: '~/.config/nvim',
      method: 'symlink', // symlink is default
    },
  }),
  new Pkg({
    name: 'extra/git',
    config_script: `git config --global user.name 'Timm Nicolaizik'; 
        git config --global user.email 'timmmmnn@gmail.com'; 
        git config --global core.editor 'nvim'; 
        git config --global init.defaultBranch main; 
        git config --global credential.helper store`,
  }),
  new Pkg({
    name: 'extra/kitty',
    config: {
      src: path.join(__dirname, 'pkg_configs/kitty'),
      target: '~/.config/kitty',
    },
  }),
  new Pkg({
    name: 'aur/nodejs-emmet-ls',
    install_with:
      AurHelper.yay /* Default is config.aur_helper for aur and pacman for other packages */,
  }),
  pkg('extra/typescript-language-server'),
  pkg('aur/1password'),
  pkg('extra/otf-firamono-nerd'),
  pkg('extra/unzip'),
  pkg('extra/bluetui'),
  pkg('extra/gnome-calculator'),
  pkg('extra/code'),
  pkg('extra/bat'),
  pkg('extra/vlc'),
  pkg('extra/qtcreator'),
  pkg('core/python'),
  pkg('extra/python-pip'),
  pkg('extra/qt6-tools'),
  pkg('aur/insomnia'),
  pkg('extra/dolphin'),
  pkg('extra/prettier'),
  pkg('extra/docker'),
  pkg('aur/docker-desktop'),
  pkg('ttf-nerd-fonts-symbols'),
  pkg('extra/tldr'),
  pkg('extra/wl-clipboard'),
  pkg('extra/bluez'),
  new Pkg({
    name: 'extra/zsh',
    postInstall:
      'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
  }),
  pkg('extra/rust'),
  pkg('extra/firefox'),
] satisfies Config['packages']
