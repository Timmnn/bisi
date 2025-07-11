import path from 'path'
import { pathToFileURL } from 'url'
import { JsonConfig, type Config } from './config_schema'

export const parseConfig = async (inputFile: string): Promise<JsonConfig> => {
  const fullPath = path.resolve(inputFile)
  const fileUrl = pathToFileURL(fullPath).href
  const imported = (await import(fileUrl)).default as Config

  const json: JsonConfig = {
    ...imported,
    packages: imported.packages.map((p) => p.to_json()),
    services: imported.services.map((s) => s.to_json()),
  }

  return json
}
