import { program } from "commander";
import { z } from "zod";
import path from "path";
import { execSync } from "child_process";
import { pathToFileURL } from "url";

const ConfigSchema = z
  .object({
    users: z.array(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    ),
    aur_helper: z.enum(["yay"]),
    packages: z.array(
      z.union([
        z.object({
          name: z.string(),
          groupInstall: z.enum(["all"]).optional(),
          postInstall: z.string().optional(),
        }),
        z.string(),
      ])
    ),
  })
  .strict();

export type Config = z.infer<typeof ConfigSchema>;

const parseConfig = async (inputFile: string): Promise<Config> => {
  const fullPath = path.resolve(inputFile);
  const fileUrl = pathToFileURL(fullPath).href;

  const imported = await import(fileUrl);

  const config = ConfigSchema.parse(imported.default);

  return config;
};

const isArchPackageGroup = (name: string) => {
  try {
    const output = execSync(`pacman -Sg ${name}`);
    return true;
  } catch (e) {
    return false;
  }
};

const installAurHelper = async (
  aurHelper: Config["aur_helper"],
  dryRun: boolean
) => {
  return new Promise<void>((resolve) => {
    const commands: {
      [key in Config["aur_helper"]]: string;
    } = {
      yay: "sudo bash ./install_yay.sh",
    };

    const command = commands[aurHelper];

    console.log(`RUNNING: '${command}'`);

    if (!dryRun) {
      execSync(command);
    }

    resolve();
  });
};

const installPackages = async (
  packages: Config["packages"],
  dryRun: boolean
) => {
  console.log(
    `Installing Packages: [${packages
      .map((p) => (typeof p === "string" ? p : p.name))
      .join(", ")}]`
  );

  if (!dryRun) {
    for (let pkg of packages) {
      const name = typeof pkg === "string" ? pkg : pkg.name;
      if (await isArchPackageGroup(name)) {
        execSync(`printf '\ny\n' | yay -S ${name}`);
      } else {
        execSync(`yes | yay -S ${name}`);
      }

      if (typeof pkg !== "string" && pkg.postInstall) {
        execSync(pkg.postInstall);
      }
    }
  }
};

const main = async (inputFile: string, dryRun: boolean) => {
  const config = await parseConfig(inputFile);

  await installAurHelper(config.aur_helper, dryRun);
  await installPackages(config.packages, dryRun);
};

program
  .version("0.0.1")
  .description("Bisi CLI")
  .argument("<input-file>")
  .option("--dry-run", "dry run")
  .action((file, options) => {
    main(file, !!options.dryRun).catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
  });

program.parse(process.argv);
