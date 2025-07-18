import { type ConfigData } from './config_schema'

export enum AurHelper {
  yay = 'yay',
  paru = 'paru',
  pikaur = 'pikaur',
  aurutils = 'aurutils',
  pakku = 'pakku',
  aura = 'aura',
  yaourt = 'yaourt',
}

type PkgInstallWith = 'pacman' | keyof typeof AurHelper
type PkgConfigOptions = {
  src: string
  target: string
  method?: 'symlink' | 'copy'
}

type PkgConfig = {
  name: string
  custom_install_script?: string
  dependencies: Pkg[]
  install_with: PkgInstallWith
  postInstall?: string
  config?: Required<PkgConfigOptions>
  exclude: string[]
  check_installed_command?: string;
}

type PkgConstructorOptions = {
  name: string
  install_with?: PkgInstallWith
  custom_install_script?: string
  config?: PkgConfigOptions
  dependencies?: Pkg[]
  config_script?: string
  postInstall?: string
  exclude?: string[]
  check_installed_command?: string;
}

export class Pkg {
  config: PkgConfig
  constructor(options: PkgConstructorOptions) {
    this.config = {
      ...options,
      install_with: options.install_with || 'pacman',
      config: options.config && {
        ...options.config,
        method: options.config?.method || 'symlink',
      },
      dependencies: options.dependencies || [],
      exclude: options.exclude || [],
    }
  }

  to_json() {
    return { ...this.config }
  }
}

type ServiceConfig = { name: string }

export class Service {
  config: ServiceConfig
  constructor(options: { name: string }) {
    this.config = { ...options }
  }

  to_json() {
    return { ...this.config }
  }
}

export class Config {
  config: ConfigData
  constructor(options: {
    aur_helper?: AurHelper
    packages?: Pkg[]
    services?: Service[]
  }) {
    this.config = {
      ...options,
      aur_helper: options.aur_helper || AurHelper.yay,
      services: options.services || [],
      packages: options.packages || [],
    }
  }

  merge(second_config: Config) {
    this.config = {
      ...this.config,
      packages: [...this.config.packages, ...second_config.config.packages],
      services: [...this.config.services, ...second_config.config.services],
    }

    return this
  }

  to_json(){
    return {
      ...this.config,
      packages: this.config.packages.map(p=>p.to_json()),
      services: this.config.services.map(s=>s.to_json())
    }
  }
}
