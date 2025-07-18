import json
from lib.bash import BashCommand


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


def sync(config):
    # Get all installed packages
    result = BashCommand("pacman -Qi").run(False)
    if not result:
        return

    installed_packages = []

    for p in result["stdout"].split("\n\n"):
        if p == "":
            continue

        lines = p.split("\n")

        installed_packages.append(
            {
                "package": next(x for x in lines if x.startswith("Name"))
                .split(":")[1]
                .strip(),
                "install_reason": next(
                    x for x in lines if x.startswith("Install Reason")
                )
                .split(":")[1]
                .strip(),
            }
        )

    all_packages = extract_keys(config["packages"])

    for package in installed_packages:

        if "Explicitly installed" in package["install_reason"]:
            if package["package"] in all_packages:
                print(f"Package '{package["package"]}' properly synced")
            elif package["package"] not in config["system_packages"]:
                while True:
                    input_text = input(
                        f"Package '{package["package"]}' was manually installed by isnt part of the config. Do you want to add it? (y/n)"
                    )

                    if input_text == "y":
                        repo = input("Repo?")

                        config["packages"][package["package"]] = {"repository": repo}

                        print("Added package to config")
                        break
                    elif input_text == "n":
                        config["system_packages"].append(package)
                        break
    return config
