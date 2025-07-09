import { type Config } from "./config_schema";
export type { Config };

export enum AurHelper {
  yay = "yay",
  paru = "paru",
  pikaur = "pikaur",
  aurutils = "aurutils",
  pakku = "pakku",
  aura = "aura",
  yaourt = "yaourt",
}

type PkgInstallWith = "pacman" | keyof typeof AurHelper;
type PkgConfigOptions = {
  src: string;
  target: string;
  method?: "symlink" | "copy";
};

type PkgConfig = {
  name: string;
  install_with: PkgInstallWith;
  config?: Required<PkgConfigOptions>;
};
type PkgConstructorOptions = {
  name: string;
  install_with?: PkgInstallWith;
  config?: PkgConfigOptions;
  config_script?: string;
};

export class Pkg {
  config: PkgConfig;
  constructor(options: PkgConstructorOptions) {
    this.config = {
      ...options,
      install_with: options.install_with || "pacman",
      config: options.config && {
        ...options.config,
        method: options.config?.method || "symlink",
      },
    };
  }

  to_config_json() {
    return {
      name: this.config.name,
      install_with: this.config.install_with,
    };
  }
}

type ServiceConfig = { name: string };

export class Service {
  config: ServiceConfig;
  constructor(options: { name: string }) {
    this.config = { ...options };
  }

  to_config_json() {
    return {};
  }
}
