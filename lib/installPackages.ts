import { existsSync, readFileSync, writeFileSync } from "fs";
import { type Config } from "./main";
import { exec, execSync } from "child_process";

export const installPackages = async (
  packages: Config["packages"],
  dryRun: boolean,
  reinstall: string[],
) => {
  console.log(
    `Installing Packages: [${packages
      .map((p) => (typeof p === "string" ? p : p.name))
      .join(", ")}]`,
  );

  for (const pkg of packages) {
    const name = typeof pkg === "string" ? pkg : pkg.name;

    if (!dryRun) {
      console.log(`Checking if package '${name}' is installed`);

      if ((await isPackageInstalled(name)) && !reinstall.includes(name)) {
        console.log("Package already installed");
        continue;
      }

      console.log("Package not installed. Installing...");

      await installPackage(name);

      if (typeof pkg !== "string" && pkg.config_src && pkg.config_target) {
        execSync(
          `ln -s $(realpath ${pkg.config_src}) $(realpath ${pkg.config_target})`,
        );
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
        console.log(`Successfully installed ${packageName}`);
        resolve();
      } else {
        console.error(`Error installing ${packageName}. Exit code: ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });

  const packages_file = "./installed_packages.json";
  const installed_packages = JSON.parse(
    readFileSync(packages_file).toString(),
  ) as string[];

  installed_packages.push(packageName);

  writeFileSync(packages_file, JSON.stringify(installed_packages));
};

const isPackageInstalled = (packageName: string) => {
  const packages_file = "./installed_packages.json";

  if (!existsSync(packages_file)) writeFileSync(packages_file, "[]");

  const installed_packages = JSON.parse(
    readFileSync(packages_file).toString(),
  ) as string[];

  return installed_packages.includes(packageName);
};
