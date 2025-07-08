import { env } from "./env";
import { type Config } from "../../lib/main";
import base_modules from "./base_modules";
import xfce from "./xfce";

export default {
  users: [
    {
      username: "timm",
      password: env.timm_pw,
    },
  ],
  aur_helper: "yay",
  packages: [...base_modules, ...xfce],
} satisfies Config;
