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
      name: "extra/neovim",
    },
    {
      name: "extra/unzip",
    },
  ],
} satisfies Config;
