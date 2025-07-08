export default [
  {
    name: "extra/neovim",
    //postInstall: `cp -r ../configs/first_config/neovim/ ~/.config/nvim`,
    config_src: "../configs/first_config/neovim/",
    config_target: "~/.config/nvim",
  },
  "extra/typescript-language-server",
  "aur/1password",
  {
    name: "extra/kitty",
    config_src: "../configs/first_config/kitty/",
    config_target: "~/.config/kitty",

  },
  "extra/otf-firamono-nerd",
  "aur/nodejs-emmet-ls",
  "extra/unzip",
  "extra/bluetui",
  "extra/gnome-calculator",
  "extra/code",
  "extra/bat",
  "extra/vlc",
  "extra/qtcreator",
  "core/python",
  "extra/python-pip",
  "extra/qt6-tools",
  "aur/insomnia",
  "extra/dolphin",
  "extra/firefox",
  {
    name: "extra/git",
    // Runs just once after instllation
    postInstall: `git config --global user.name 'Timm Nicolaizik'; 
        git config --global user.email 'timmmmnn@gmail.com'; 
        git config --global core.editro 'nvim'; 
        git config --global credential.helper store`,
  },
];
