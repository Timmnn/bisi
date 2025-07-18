import { program } from 'commander'
import { installPackages } from './install_packages'
import { installAurHelper } from './install_aur_helper'
import { parseConfig } from './parse_config'
import { startServices } from './start_services'

const main = async (
  inputFile: string,
  dryRun: boolean,
  reinstall: string[]
) => {
  const config = await parseConfig(inputFile)
  await installAurHelper(config.aur_helper, dryRun)
  await installPackages(config.packages, dryRun, reinstall)
  startServices(config.services, dryRun)
}

program
  .version('0.0.1')
  .description('Bisi CLI')
  .argument('<input-file>')
  .option('--dry-run', 'dry run')
  .option('--reinstall [PACKAGES]', 'reinstall')
  .action((file, options) => {
    const reinstall = options.reinstall?.replaceAll(' ', '')?.split(',') || []

    main(file, !!options.dryRun, reinstall).catch((err) => {
      console.error('Error:', err)
      process.exit(1)
    })
  })

program.parse(process.argv)
