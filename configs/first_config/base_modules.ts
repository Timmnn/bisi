export default [
  {
    name: "extra/neovim",
    //postInstall: `cp -r ../configs/first_config/neovim/ ~/.config/nvim`,
    config_src: "../configs/first_config/neovim/",
    config_target: "~/.config/nvim",
  },
  "extra/unzip",
  "extra/code",
  "extra/bat",
  "extra/firefox",
  {
    name: "extra/git",
    // Runs just once after instllation
    postInstall: `git config --global user.name 'Timm Nicolaizik'; 
        git config --global user.email 'timmmmnn@gmail.com'; 
        git config --global credential.helper store`,
  },
];
