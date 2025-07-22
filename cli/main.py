import sys
import json
from cli.backup import backup_folder
from cli.apply import apply
from cli.sync import sync
from lib.config_parser import Config, Package


if len(sys.argv) < 3:
    print("Not enough arguments")
    exit(1)

command = sys.argv[1]
config_path = sys.argv[2]


config = None


config_json = {}
with open(config_path + "/config.json") as f:
    config_json = json.load(f)

    config = Config(config_json)


if command == "add_package":
    package = sys.argv[2]

    repository, name = package.split("/")

    if name in [p.name for p in config.packages]:
        print("Package already installed")
        exit(1)

    config.packages.append(Package(repository=repository, name=name))

    with open("config.json", "w") as f:
        f.write(json.dumps(config.to_dict()))

elif command == "apply":
    apply(config, config_path)


elif command == "sync":
    new_config = sync(config)
    with open("/home/timm/bisi-config/config.json", "w") as f:
        config_dict = new_config.to_dict()
        print(config_dict)
        f.write(json.dumps(config_dict))

elif command == "backup":
    for backup in config.backups:
        backup_folder(backup.path, backup.backup_key)
else:
    print("No command specified.")
    exit(1)
