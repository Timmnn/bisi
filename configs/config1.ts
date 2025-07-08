import { env } from "./config1_env";
import { type Config } from "../lib/main";

export default {
  users: [
    {
      username: "timm",
      password: env.timm_pw,
    },
  ],
  aur_helper: "yay",
  packages: [
    "extra/neovim",
    "extra/unzip",
    {
      name: "extra/lightdm",
      postInstall: "sudo systemctl enable lightdm.service",
    },
    {
      name: "extra/git",
      postInstall:
        "git config --global user.name 'Timm Nicolaizik'; git config --global user.email 'timmmmnn@gmail.com'",
    },
    {
      name: "xorg",
      groupInstall: "all",
    },
  ],
} satisfies Config;
