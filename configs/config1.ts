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
    {
      name: "neovim",
    },
    {
      name: "unzip",
    },
  ],
} satisfies Config;
