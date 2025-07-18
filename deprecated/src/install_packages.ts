import { JsonConfig } from './config_schema'
import { execSync } from 'child_process'
import { BashCommand } from './exec'

export const installPackages = async (
    packages: JsonConfig['packages'],
    dryRun: boolean,
    reinstall: string[]
) => {
    console.log(
        `Installing Packages: [${packages.map((p) => p.name).join(',\n\t')}\n]`
    )
    for (const pkg of packages) {
        const name = pkg.name







        if (!dryRun) {
            //console.log(`📦 Checking if package '${name}' is installed`)

            if (pkg.config) {
                execSync(`rm -f ${pkg.config.target}`)
                execSync(
                    `ln -s $(realpath ${pkg.config.src}) $(realpath ${pkg.config.target})`
                )
            }

            if (packageIsGroup(name) && groupIsInstalled(name)) {
                console.log('Group already installed.')
                continue
            }

            if (isPackageInstalled(name, pkg.check_installed_command) && !reinstall.includes(name)) {
                continue
            }

            console.log('Package not installed. Installing...')

            await installPackage(name, pkg.exclude, pkg.custom_install_script)

            // Run post-install commands if applicable
            if (pkg.postInstall) {
                const bash = new BashCommand(pkg.postInstall, dryRun)
                bash.run()
            }
        }
    }
}

const installPackage = async (packageName: string, exclude: string[], custom_install_command?: string) => {
    const installer = packageName.startsWith('aur/') ? 'yay' : 'sudo pacman'

    // enter 'n' for each excluded package and enter 2 more times
    const command = custom_install_command || exclude.length ? `printf '${exclude.map(() => 'n\\n')}\\n\\n' | ${installer} -Syu ${packageName} --ignore '${exclude.join(',')}'` : `${installer} -Syu ${packageName} --noconfirm`



    const bash = new BashCommand(command, false)
    bash.run()
}

const isPackageInstalled = (packageName: string, customCommand?: string) => {
    const name = packageName.includes('/')
        ? packageName.split('/')[1]
        : packageName


    const command = customCommand || `pacman -Q ${name}`

    const bash = new BashCommand(command, false)
    const output = bash.run(false)

    return !output.stderr.includes('was not found')
}

const packageIsGroup = (packageName: string) => {
    const bash = new BashCommand(`pacman -Sg ${packageName}`, false)
    const output = bash.run(false)


    return output.stdout.includes(packageName)
}

const groupIsInstalled = (groupName: string) => {
    const bash = new BashCommand(
        `pacman -Sg ${groupName} | awk '{print $2}' | xargs pacman -Q`,
        false
    )
    const output = bash.run()

    return output.status === 0
}
