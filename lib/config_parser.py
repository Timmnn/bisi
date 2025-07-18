from typing import Any, List


class Backup:
    path: str
    backup_key: str
    exclude_patterns: List[str]
    providers: Any


class Package:
    repository: str
    tags: List[str]
    dependencies: dict
    name: str


class Config:
    version: int
    packages: List[Package]
    system_packages: List[str]
    backups: List[Backup]

    def __init__(self, config_json: dict[str, Any]) -> None:

        version = config_json["version"]

        if not version or type(version) != "int" or version <= 0:
            raise BaseException("Invalid version property. Has to be a int above 0")

        pass
