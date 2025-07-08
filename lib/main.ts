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
      }),
    ),
    aur_helper: z.enum(["yay"]),
    packages: z.array(z.object({ name: z.string() })),
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

const installAurHelper = async (
  aurHelper: Config["aur_helper"],
  dryRun: boolean,
) => {
  return new Promise<void>((resolve) => {
    const commands: {
      [key in Config["aur_helper"]]: string;
    } = {
      yay: "sudo pacman -S --needed git base-devel && rm -r ./yay/ && git clone https://aur.archlinux.org/yay-bin.git && cd yay-bin && makepkg -si && cd .. && sudo rm -r ./yay/",
    };

    const command = commands[aurHelper];

    console.log(`RUNNING: '${command}'`);

    if (!dryRun) {
      execSync(command);
      resolve();
    }
  });
};

const main = async (inputFile: string, dryRun: boolean) => {
  const config = await parseConfig(inputFile);

  await installAurHelper(config.aur_helper, dryRun);
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
