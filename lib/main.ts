import { program } from "commander";
import { z } from "zod";
import path from "path";
import { pathToFileURL } from "url";

const ConfigSchema = z
  .object({
    users: z.array(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    ),
    packages: z.array(z.object({ name: z.string() })),
  })
  .strict();

export type Config = z.infer<typeof ConfigSchema>;

async function main(inputFile: string) {
  const fullPath = path.resolve(inputFile);
  const fileUrl = pathToFileURL(fullPath).href;

  const imported = await import(fileUrl);

  const config = ConfigSchema.parse(imported.default);

  console.log(config);
}

program
  .version("0.0.1")
  .description("Bisi CLI")
  .argument("<input-file>")
  .action((file) => {
    main(file).catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
  });

program.parse(process.argv);
