import { env } from "./config1_env";
import { type Config } from "../lib/main";

export default {
  users: [
    {
      username: "timm",
      password: env.timm_pw,
    },
  ],

  packages: [
    {
      name: "neovim",
    },
  ],
} as Config;
