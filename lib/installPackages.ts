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

    if (!dryRun) {
      if (!(await isPackageInstalled(name))) {
        await installPackage(name);
      }

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

const installPackage = async (packageName: string) => {
  const command = `sudo pacman -Syu --noconfirm ${packageName}`;
  console.log(`RUNNING: ${command}`);
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
};

const isPackageInstalled = async (packageName: string) => {
  const command = `pacman -Q ${packageName} &> /dev/null`;

  return new Promise((resolve) => {
    exec(command, (error) => {
      // If error is null, the command exited with 0, meaning the package is installed.
      // Otherwise, an error (non-zero exit code) indicates it's not installed.
      if (error) {
        // console.log(`Package "${packageName}" not found: ${error.message}`); // For debugging
        resolve(false);
      } else {
        // console.log(`Package "${packageName}" is installed.`); // For debugging
        resolve(true);
      }
    });
  });
};
