from typing import List, Optional
from textual.app import ComposeResult, RenderResult
from textual.containers import Vertical
from textual.screen import Screen
from textual.widget import Widget
from textual.widgets import Footer, Static
import json


class Package:
    repository: str
    name: str
    label: Optional[str]
    tags: Optional[List[str]]

    def __init__(
        self,
        repository: str,
        name: str,
        label: Optional[str],
        tags: Optional[List[str]],
    ) -> None:
        self.repository = repository
        self.name = name
        self.label = label
        self.tags = tags

        pass


class PackageWidget(Widget):
    package: Package

    def __init__(
        self,
        *children: Widget,
        name: str | None = None,
        id: str | None = None,
        classes: str | None = None,
        disabled: bool = False,
        markup: bool = True,
        package: Package,
    ) -> None:
        super().__init__(
            *children,
            name=name,
            id=id,
            classes=classes,
            disabled=disabled,
            markup=markup,
        )

        self.package = package

    def compose(self):
        package = self.package
        text = f"{package.repository}/{package.name}"

        if package.label:
            text += f" ({package.label})"

        if package.tags:
            text += f"  #{",".join(package.tags)}"

        yield Static(f"- {text}")


class Config:
    version: int
    packages: List[Package]
    tags: Optional[List[str]]

    def __init__(self, config_file_path: str) -> None:

        with open(config_file_path) as f:
            data = json.load(f)

            if not data["version"]:
                raise BaseException("Version not set")

            if not data["packages"]:
                raise BaseException("Packages not set")

            self.version = data["version"]
            self.packages = [
                Package(
                    name=p["name"],
                    repository=p["repository"],
                    label=p["label"],
                    tags=p["tags"],
                )
                for p in data["packages"]
            ]

        pass


class ConfigScreen(Screen):
    config: Config

    CSS = """
        PackageWidget{
            height: 1
        }
        

    """

    def __init__(
        self, name: str | None = None, id: str | None = None, classes: str | None = None
    ) -> None:
        super().__init__(name, id, classes)

        # Assuming config.json exists at this path for testing
        self.config = Config("/home/timm/bisi/bisi-tui/config.json")

    def compose(self) -> ComposeResult:
        with Vertical():
            for package in self.config.packages:
                # Assign a unique ID to each PackageWidget
                yield PackageWidget(
                    package=package, id=f"package-{package.repository}-{package.name}"
                )

        yield Footer()
