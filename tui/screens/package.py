from textual.app import ComposeResult
from textual.containers import Vertical
from textual.screen import Screen
from textual.scroll_view import ScrollView
from textual.widgets import Collapsible, Footer, Static, TextArea
from ..pacman_helpers import get_arch_packages, get_installed_packages


class PackageScreen(Screen):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.packages = get_arch_packages("extra") + get_arch_packages("core")
        self.installed_packages = get_installed_packages()
        self.filter_text = ""

    def compose(self) -> ComposeResult:
        with Vertical():
            yield Collapsible(
                TextArea(id="filter_input"),
                ScrollView(id="package_list"),
                title="Available Packages",
            )

            yield Collapsible(
                ScrollView(id="installed_packages"), title="Installed Packages"
            )

        yield Footer()

    def on_mount(self) -> None:
        # Initial population of packages after widgets are mounted
        self.update_package_list()

    def on_text_area_changed(self, message: TextArea.Changed) -> None:
        if message.text_area.id == "filter_input":
            self.filter_text = message.text_area.text
            self.update_package_list()

    def update_package_list(self):
        # Get the ScrollView container
        package_container = self.query_one("#package_list")
        installed_packages_container = self.query_one("#installed_packages")

        # Clear existing packages
        package_container.remove_children()
        installed_packages_container.remove_children()

        # Filter packages based on current filter text
        current_filter = self.filter_text.lower()
        filtered_packages = [p for p in self.packages if current_filter in p.lower()]

        for package in filtered_packages[:5]:
            package_container.mount(Static(package, classes="package-item"))
        package_container.mount(Static("..."))

        for package in self.installed_packages:
            installed_packages_container.mount(Static(package))
