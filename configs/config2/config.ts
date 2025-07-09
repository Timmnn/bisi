import { AurHelper, type Config } from "../../src/config_utils";
import basic_packages from "./basic_packages";
import kde from "./kde";

export default {
    aur_helper: AurHelper.yay,
    packages: [...basic_packages, ...kde.packages],
    services: [...kde.services],
} satisfies Config;
