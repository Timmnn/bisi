from textual.app import App, ComposeResult, RenderResult
from textual.widgets import Collapsible, Footer, TextArea, Static
from textual.binding import Binding
from .screens.config import ConfigScreen
from .screens.package import PackageScreen


class ClockApp(App):
    BINDINGS = [
        Binding(key="q", action="quit", description="quit"),
        Binding(key="p", action="push_screen('packages')", description="packages"),
        Binding(key="c", action="push_screen('config')", description="config"),
    ]
    SCREENS = {"packages": PackageScreen, "config": ConfigScreen}
    CSS = """
    Screen { align: center middle; }
    
    TextArea {
        height: 3;
        width: 100%;
    }
    
    PackageScreen {
        layout: vertical;
        align_horizontal: center;
        width: 100%;
        height: 100%;
    }
    
    #package_list {
        height: 1fr;
        width: 100%;
        border: round #555;
        background: #222;
    }
    
    .package-item {
        color: #eee;
    }
    """

    def compose(self) -> ComposeResult:
        yield Footer()

    def show_packages(self):
        pass


if __name__ == "__main__":
    app = ClockApp()
    app.run()
