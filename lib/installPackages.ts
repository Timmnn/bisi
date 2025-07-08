import { type Config } from "./main";
import { exec } from "child_process";

export const installPackages = async (
  packages: Config["packages"],
  dryRun: boolean,
) => {
  console.log(
    `Installing Packages: [${packages
      .map((p) => (typeof p === "string" ? p : p.name))
      .join(", ")}]`,
  );

  for (const pkg of packages) {
    const name = typeof pkg === "string" ? pkg : pkg.name;
    const command = `sudo pacman -Syu --noconfirm ${name}`;
    console.log(`RUNNING: ${command}`);

    if (!dryRun) {
      // Execute the command asynchronously to capture stdout and stderr
      const child = exec(command);

      // Log stdout in green
      child.stdout?.on("data", (data) => {
        process.stdout.write(`\x1b[32m${data}\x1b[0m`);
      });

      // Log stderr in red
      child.stderr?.on("data", (data) => {
        process.stderr.write(`\x1b[31m${data}\x1b[0m`);
      });

      // Wait for the command to finish
      await new Promise<void>((resolve, reject) => {
        child.on("close", (code) => {
          if (code === 0) {
            console.log(`Successfully installed ${name}`);
            resolve();
          } else {
            console.error(`Error installing ${name}. Exit code: ${code}`);
            reject(new Error(`Command failed with code ${code}`));
          }
        });
      });

      // Run post-install commands if applicable
      if (typeof pkg !== "string" && pkg.postInstall) {
        console.log(`RUNNING POST-INSTALL: ${pkg.postInstall}`);
        const postInstallChild = exec(pkg.postInstall);

        postInstallChild.stdout?.on("data", (data) => {
          process.stdout.write(`\x1b[32m${data}\x1b[0m`);
        });

        postInstallChild.stderr?.on("data", (data) => {
          process.stderr.write(`\x1b[31m${data}\x1b[0m`);
        });

        await new Promise<void>((resolve, reject) => {
          postInstallChild.on("close", (code) => {
            if (code === 0) {
              console.log(`Successfully ran post-install for ${name}`);
              resolve();
            } else {
              console.error(
                `Error running post-install for ${name}. Exit code: ${code}`,
              );
              reject(
                new Error(`Post-install command failed with code ${code}`),
              );
            }
          });
        });
      }
    }
  }
};
