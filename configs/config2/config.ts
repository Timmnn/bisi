import { AurHelper, type Config } from "../../src/config_utils";
import basic_packages from "./basic_packages";
import gnome from "./gnome";

export default {
  aur_helper: AurHelper.yay,
  packages: [...basic_packages, ...gnome.packages],
  services: [gnome.services],
} satisfies Config;
