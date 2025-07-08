export default [
  { name: "extra/neovim", postInstall: `cp ./neovim/ ~/.config/nvim` },
  "extra/unzip",
  "extra/code",
  "extra/bat",
  "extra/firefox",
  {
    name: "extra/git",
    postInstall: `git config --global user.name 'Timm Nicolaizik'; 
        git config --global user.email 'timmmmnn@gmail.com'; 
        git config --global credential.helper store`,
  },
];
