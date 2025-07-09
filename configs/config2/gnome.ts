import { Service, type Config } from "../../src/config_utils";
import { pkg } from "./utils";

export default {
    packages: [pkg("gnome")] satisfies Config["packages"],
    services: [new Service({ name: "gdm.service" })] satisfies Config["services"],
};
