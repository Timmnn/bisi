import { type Config } from "./config_schema";
import { execSync } from "child_process";
import { BashCommand } from "./exec";

export const installAurHelper = async (
    aurHelper: Config["aur_helper"],
    dryRun: boolean,
) => {
    return new Promise<void>((resolve) => {
        const commands: {
            [key in Config["aur_helper"]]: string;
        } = {
            yay: "yes | bash ./install_yay.sh",
            aura: "echo 'NOT YET IMPLEMENTED'",
            yaourt: "echo 'NOT YET IMPLEMENTED'",
            paru: "echo 'NOT YET IMPLEMENTED'",
            pikaur: "echo 'NOT YET IMPLEMENTED'",
            pakku: "echo 'NOT YET IMPLEMENTED'",
            aurutils: "echo 'NOT YET IMPLEMENTED'"
        };

        const command = commands[aurHelper];

        const bash = new BashCommand(command, dryRun);
        bash.run();

        resolve();
    });
};
