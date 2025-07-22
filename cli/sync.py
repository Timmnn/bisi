from typing import List
from lib.bash import BashCommand
from lib.config_parser import Config, Package
from lib.installed_packages import InstalledPackage, get_installed_packages


def extract_keys(obj):
    keys = set()

    def recurse(sub_obj):
        for key, value in sub_obj.items():
            keys.add(key)
            if isinstance(value, dict) and "dependencies" in value:
                deps = value["dependencies"]
                if isinstance(deps, dict):
                    recurse(deps)

    recurse(obj)
    return list(keys)


def sync(config: Config):
    # Get all installed packages

    all_packages = config.packages_including_deps()

    installed_packages = get_installed_packages()

    for package in installed_packages:
        if package.installed_manually:
            if package.name in all_packages:
                print(f"Package '{package.name}' properly synced")
            elif package.name not in config.system_packages:
                while True:
                    input_text = input(
                        f"Package '{package.name}' was manually installed by isnt part of the config. Do you want to add it? (y/n)"
                    )

                    if input_text == "y":
                        repo = input("Repo?")

                        config.packages.append(
                            Package(name=package.name, repository=repo)
                        )

                        print("Added package to config")
                        break
                    elif input_text == "n":
                        config.system_packages.append(package.name)
                        break
    return config
