import { Service, type Config } from "../../src/config_utils";
import { pkg } from "./utils";

export default {
    packages: [pkg("plasma"), pkg("kde-applications")] satisfies Config["packages"],
    services: [new Service({ name: "sddm.service" })] satisfies Config["services"],
};
