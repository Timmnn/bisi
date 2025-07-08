import { program } from "commander";
import { installPackages } from "./installPackages";
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
      }),
    ),
    aur_helper: z.enum(["yay"]),
    packages: z.array(
      z.union([
        z.object({
          name: z.string(),
          groupInstall: z.enum(["all"]).optional(),
          postInstall: z.string().optional(),
          config_src: z.string().optional(),
          config_target: z.string().optional(),
        }),
        z.string(),
      ]),
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
  dryRun: boolean,
) => {
  return new Promise<void>((resolve) => {
    const commands: {
      [key in Config["aur_helper"]]: string;
    } = {
      yay: "yes | bash ./install_yay.sh",
    };

    const command = commands[aurHelper];

    console.log(`RUNNING: '${command}'`);

    if (!dryRun) {
      execSync(command);
    }

    resolve();
  });
};

const main = async (
  inputFile: string,
  dryRun: boolean,
  reinstall: string[],
) => {
  const config = await parseConfig(inputFile);

  await installAurHelper(config.aur_helper, dryRun);
  await installPackages(config.packages, dryRun, reinstall);
};

program
  .version("0.0.1")
  .description("Bisi CLI")
  .argument("<input-file>")
  .option("--dry-run", "dry run")
  .option("--reinstall [PACKAGES]", "reinstall")
  .action((file, options) => {
    const reinstall = options.reinstall?.replaceAll(" ", "")?.split(",") || [];

    main(file, !!options.dryRun, reinstall).catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
  });

program.parse(process.argv);
