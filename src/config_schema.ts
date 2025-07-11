import { AurHelper, Pkg, Service } from './config_utils'

export type ConfigData = {
  aur_helper: AurHelper
  packages: Pkg[]
  services: Service[]
}

export type JsonConfig = {
  aur_helper: AurHelper
  packages: ReturnType<Pkg['to_json']>[]
  services: ReturnType<Service['to_json']>[]
}
