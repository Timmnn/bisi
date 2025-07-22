from typing import List
from lib.bash import BashCommand


class InstalledPackage:
    name: str
    installed_manually: bool

    def __init__(self, pacman_output: str) -> None:
        lines = pacman_output.split("\n")

        name = next(x for x in lines if x.startswith("Name")).split(":")[1].strip()

        install_reason = (
            next(x for x in lines if x.startswith("Install Reason"))
            .split(":")[1]
            .strip()
        )

        self.name = name
        self.installed_manually = "Explicitly installed" in install_reason


def get_installed_packages() -> List[InstalledPackage]:
    result = BashCommand("pacman -Qi").run(False)
    if not result:
        raise BaseException("Unknown Error")

    installed_packages: List[InstalledPackage] = []

    for p in result["stdout"].split("\n\n"):
        if p == "":
            continue

        installed_packages.append(InstalledPackage(p))

    return installed_packages
