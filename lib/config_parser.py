from typing import Any, List, Optional, Union


class Backup:
    path: str
    backup_key: str
    exclude_patterns: List[str]
    providers: Any

    def __init__(
        self,
        path: str,
        backup_key: str,
        providers: Any,
        exclude_patterns: List[str] = [],
    ) -> None:
        self.path = path
        self.backup_key = backup_key
        self.providers = providers
        self.exclude_patterns = exclude_patterns

        pass

    def to_dict(self) -> dict[str, Any]:
        return {
            "path": self.path,
            "backup_key": self.backup_key,
            "exclude_patterns": self.exclude_patterns,
            "providers": self.providers,
        }


class Package:
    repository: str
    tags: List[str]
    dependencies: List["Package"]
    name: str
    label: Optional[str]
    config: Optional[dict[str, str]]
    init_script: Optional[str]

    def __init__(
        self,
        repository: str,
        name: str,
        label: Optional[str] = None,
        tags: List[str] = [],
        dependencies: List["Package"] = [],
        config: Optional[dict] = {},
        init_script: Optional[str] = None,
    ) -> None:
        self.repository = repository
        self.tags = tags

        self.dependencies = [Package(**d) for d in dependencies]  # type: ignore
        self.label = label
        self.config = config
        self.init_script = init_script

        self.name = name

    def __eq__(self, other: Any) -> bool:
        if not isinstance(other, Package):
            return NotImplemented
        return (
            self.repository == other.repository
            and self.name == other.name
            and self.tags == other.tags
            and self.dependencies == other.dependencies
        )

    def __hash__(self) -> int:
        return hash(
            (
                self.repository,
                self.name,
                tuple(sorted(self.tags)),  # Sort tags for consistent hashing
                frozenset(
                    sorted(
                        [d.to_dict() for d in self.dependencies],
                        key=lambda x: str(x),
                    )
                ),
            )  # Sort items for consistent hashing
        )

    def to_dict(self) -> dict[str, Union[str, int, dict, List]]:
        return {
            "repository": self.repository,
            "tags": self.tags,
            "dependencies": [d.to_dict() for d in self.dependencies],
            "name": self.name,
        }


class ConfigDiff:
    added_packages: List[Package]
    removed_packages: List[Package]

    def __init__(
        self, added_packages: List[Package], removed_packages: List[Package]
    ) -> None:
        self.removed_packages = removed_packages
        self.added_packages = added_packages
        pass


class Config:
    version: int
    packages: List[Package]
    system_packages: List[str]
    backups: List[Backup]

    def __init__(self, config_json: dict[str, Any]) -> None:
        version = config_json["version"]
        if not version or type(version) != int or version <= 0:
            raise ValueError("Invalid version property. Has to be an int above 0")
        self.version = version
        # Initialize packages, system_packages, and backups from config_json
        self.packages = [
            Package(**p) for p in config_json.get("packages", [])
        ]  # Use Package constructor
        self.system_packages = config_json.get("system_packages", [])
        self.backups = [Backup(**b) for b in config_json.get("backups", [])]

    def packages_including_deps(self):
        def flatten_deps(pkg: Package):
            names = [pkg.name]
            for dep in pkg.dependencies:
                names += flatten_deps(dep)
            return names

        result: List[str] = []

        for pkg in self.packages:
            result += flatten_deps(pkg)

        return result

    def package_names(self):
        return [p.name for p in self.packages]

    def diff(self, old: "Config") -> ConfigDiff:

        added_packages = [p for p in self.packages if p.name not in old.package_names()]
        removed_packages = [
            p for p in old.packages if p.name not in self.package_names()
        ]

        return ConfigDiff(added_packages, removed_packages)

    def to_dict(self) -> dict[str, Any]:
        """Converts the Config object to a dictionary for JSON serialization."""
        return {
            "version": self.version,
            "packages": [p.to_dict() for p in self.packages],
            "system_packages": self.system_packages,
            "backups": [b.to_dict() for b in self.backups],
        }
