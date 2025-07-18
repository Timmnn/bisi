import path from 'path'
import { pathToFileURL } from 'url'
import { JsonConfig, type Config } from './config_schema'

export const parseConfig = async (inputFile: string): Promise<JsonConfig> => {
  const fullPath = path.resolve(inputFile)
  const fileUrl = pathToFileURL(fullPath).href
  const imported = (await import(fileUrl)).default

  console.log(imported)

  const config = imported.to_json();
  return config
}
