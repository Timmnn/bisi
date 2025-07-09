import path from "path";
import { pathToFileURL } from "url";
import { type Config } from "./config_schema";

export const parseConfig = async (inputFile: string): Promise<Config> => {
  const fullPath = path.resolve(inputFile);
  const fileUrl = pathToFileURL(fullPath).href;
  const imported = await import(fileUrl);
  const config = JSON.parse(imported.default) as Config;

  return config;
};
