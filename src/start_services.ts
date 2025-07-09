import { BashCommand } from "../bisi/src/exec";
import { Config } from "./config_schema";

export const startServices = (services: Config["services"], dryRun: boolean) => {
    for (const service of services) {
        const bash = new BashCommand(`systemctl start ${service.config.name}`, dryRun)
        bash.run()
    }
}
