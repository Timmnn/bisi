import { publicProcedure } from "../trpc";
import fs from "fs";
import { z } from "zod";

// Remove the type annotation to allow proper type inference
const PackageSchema: z.ZodType<Package> = z.lazy(() =>
  z.object({
    repository: z.string(),
    name: z.string(),
    tags: z.array(z.string()),
    dependencies: z.array(PackageSchema),
  }),
);

// Define the type first for the circular reference
type Package = {
  repository: string;
  name: string;
  tags: string[];
  dependencies: Package[];
};

const ConfigSchema = z.object({
  packages: z.array(PackageSchema),
  version: z.number(),
  system_packages: z.any(),
  backups: z.any(),
});

const getConfig = () => {
  let text = fs.readFileSync("/home/timm/bisi-config/config.json").toString();

  // Parse the JSON first, then validate with Zod
  return ConfigSchema.parse(JSON.parse(text));
};

export const procedures = {
  getConfig: publicProcedure.query(async () => {
    return getConfig();
  }),

  updateConfig: publicProcedure.input(ConfigSchema).mutation((opts) => {
    fs.writeFileSync(
      "/home/timm/bisi-config/config.json",
      JSON.stringify(opts.input),
    );
  }),
};

export type Config = z.infer<typeof ConfigSchema>;
export { type Package };
