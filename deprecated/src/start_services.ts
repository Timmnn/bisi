import { BashCommand } from './exec'
import { JsonConfig } from './config_schema'

const serviceIsRunning = (name: string) => {
  const bash = new BashCommand(`sudo systemctl is-active ${name}`, false)
  const output = bash.run()

  return output.stdout.includes('active')
}

export const startServices = (
  services: JsonConfig['services'],
  dryRun: boolean
) => {
  for (const service of services) {
    if (serviceIsRunning(service.name)) {
      console.log(`Service ${service.name} already running.`)
      continue
    }

    const bash = new BashCommand(`systemctl start ${service.name}`, dryRun)
    bash.run()
  }
}
