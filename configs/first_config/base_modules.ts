export default [
  "extra/neovim",
  "extra/unzip",
  "extra/code",
  {
    name: "extra/git",
    postInstall: `git config --global user.name 'Timm Nicolaizik'; 
        git config --global user.email 'timmmmnn@gmail.com'; 
        git config --global credential.helper store`,
  },
];
