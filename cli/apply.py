import os
from lib.config_parser import Config
from lib.bash import BashCommand
import json

from lib.installed_packages import get_installed_packages


def apply(config: Config, config_path: str):
    active_config = Config({"version": 1, "packages": []})

    if os.path.exists(config_path + "active_config.json"):
        with open(config_path + "active_config.json") as f:
            active_config = Config(json.load(f))

    config_diff = config.diff(active_config)

    print(f"Found {len(config_diff.added_packages)} new packages.")

    installed_packages = get_installed_packages()

    for added_package in config_diff.added_packages:
        if next(x for x in installed_packages if x.name == added_package.name):
            continue

        repo = added_package.repository
        name = added_package.name

        cmd = BashCommand(
            f"sudo pacman -S {repo}/{name} --noconfirm",
            f"Do you want to install {repo}/{name}",
        )

        cmd.run()

    print(f"Found {len(config_diff.removed_packages)} removed packages")

    for removed_package in config_diff.removed_packages:
        repo = removed_package.repository
        name = removed_package.name

        cmd = BashCommand(
            f"sudo pacman -R {name} --noconfirm",
            f"Do you want to remove {repo}/{name}",
        )

        cmd.run()

    with open(config_path + "active_config.json", "w") as f:
        f.write(json.dumps(config.to_dict()))
