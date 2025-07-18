import subprocess
import threading
from typing import Optional, TypedDict


class CommandResult(TypedDict):
    stdout: str
    stderr: str
    returncode: int


class BashCommand:
    command: str
    confirmation_text: Optional[str]

    def __init__(self, command: str, confirmation_text: Optional[str] = None) -> None:
        self.command = command
        self.confirmation_text = confirmation_text
        pass

    def run(self, print_stdout=True) -> CommandResult | None:

        if self.confirmation_text and not confirmation_prompt(self.confirmation_text):
            return

        process = subprocess.Popen(
            self.command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,  # Redirect stderr to stdout
            text=True,
            shell=True,
            bufsize=1,
        )

        stdout_lines = []
        stderr_lines = []

        def read_stream(stream, collector, stream_name):
            for line in iter(stream.readline, ""):
                if print_stdout:
                    print(f"{stream_name}: {line}", end="")
                collector.append(line)
            stream.close()

        stdout_thread = None
        stderr_thread = None

        if process.stdout:
            stdout_thread = threading.Thread(
                target=read_stream, args=(process.stdout, stdout_lines, "STDOUT")
            )
            stdout_thread.start()

        if process.stderr:
            stderr_thread = threading.Thread(
                target=read_stream, args=(process.stderr, stderr_lines, "STDERR")
            )
            stderr_thread.start()

        process.wait()

        if stdout_thread:
            stdout_thread.join()
        if stderr_thread:
            stderr_thread.join()

        return {
            "stdout": "".join(stdout_lines),
            "stderr": "".join(stderr_lines),
            "returncode": process.returncode,
        }


def confirmation_prompt(question: str, default="y") -> bool:
    """Prompt the user with a Y/n question. Returns True if yes, False if no."""
    default = default.lower()
    prompt = " [Y/n]: " if default == "y" else " [y/N]: "

    while True:
        choice = input(question + prompt).strip().lower()
        if choice == "" and default:
            return default == "y"
        if choice in ("y", "yes"):
            return True
        if choice in ("n", "no"):
            return False
        print("Please respond with 'y' or 'n'.")
