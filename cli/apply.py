import os
import re
from lib.json_diff import json_diff
from lib.bash import BashCommand
import json


def apply(config: dict):
    # Base config
    active_config = {"packages": {}}

    if os.path.exists("active_config.json"):
        with open("active_config.json") as f:
            active_config = json.load(f)

    config_diff = json_diff(active_config, config)
    print(active_config)

    print(config)

    print(config_diff)

    if "added" in config_diff:
        for added_package in [
            k
            for k in config_diff["added"]
            if re.match(r"^\$\.packages\.[a-z]+$", k["path"])
        ]:

            name = added_package["path"].split(".")[-1]
            print(added_package, name)
            repo = added_package["value"]["repository"]

            cmd = BashCommand(
                f"sudo pacman -S {repo}/{name} --noconfirm",
                f"Do you want to install {repo}/{name}",
            )

            cmd.run()

        with open("active_config.json", "w") as f:
            f.write(json.dumps(config))
