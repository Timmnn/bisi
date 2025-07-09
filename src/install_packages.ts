import { existsSync, readFileSync, writeFileSync } from "fs";
import { type Config } from "./config_schema";
import { exec, execSync } from "child_process";
import { BashCommand } from "./exec";

export const installPackages = async (
  packages: Config["packages"],
  dryRun: boolean,
  reinstall: string[],
) => {
  console.log(
    `Installing Packages: [${packages.map(p => p.config.name).join(",\n")}]`,
  );
  for (const pkg of packages) {
    let config = pkg.config
    const name = config.name;

    if (!dryRun) {
      console.log(`📦 Checking if package '${name}' is installed`);

      if (config.config) {


        execSync(`rm -f ${config.config.target}`);
        execSync(
          `ln -s $(realpath ${config.config.src}) $(realpath ${config.config.target})`,
        );
      }

      if ((await isPackageInstalled(name)) && !reinstall.includes(name)) {
        console.log("Package already installed");
        continue;
      }

      console.log("Package not installed. Installing...");

      await installPackage(name);

      // Run post-install commands if applicable
      if (config.postInstall) {

        const bash = new BashCommand(config.postInstall, dryRun)
        bash.run()
      }
    }
  }
};

const installPackage = async (packageName: string) => {
  const installer = packageName.startsWith("aur/") ? "yay" : "sudo pacman"
  const command = `${installer} -Syu --noconfirm ${packageName}`;


  const bash = new BashCommand(command, false);
  bash.run()


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


