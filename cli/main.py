import sys
import re
import json
from cli import backup
from cli.apply import apply
from cli.backup import backup_folder
from cli.sync import sync
from lib.bash import BashCommand
from lib.config_parser import Config
from lib.json_diff import json_diff


command = sys.argv[1]


config = None


config_json = {}
with open("/home/timm/bisi-config/config.json") as f:
    config_json = json.load(f)

    config = Config(config_json)


if command == "add_package":
    package = sys.argv[2]

    repository, name = package.split("/")

    if name in [p.name for p in config.packages]:
        print("Package already installed")
        exit(1)

    config["packages"][name] = {"repository": repository, "tags": []}

    with open("config.json", "w") as f:
        f.write(json.dumps(config))

if command == "apply":
    apply(config)


if command == "sync":
    new_config = sync(config)
    with open("/home/timm/bisi-config/config.json", "w") as f:
        f.write(json.dumps(new_config))

if command == "backup":
    for path in config["backups"].keys():

        backup_config = config["backups"][path]
        backup.backup_folder(path, backup_config["backup_key"])
