import subprocess


def get_arch_packages(repo: str, with_prefix: bool = True):
    try:
        result = subprocess.run(
            ["pacman", "-Sl", repo], capture_output=True, text=True, check=True
        )
        packages = [line.split()[1] for line in result.stdout.splitlines()]

        if with_prefix:
            packages = [f"{repo}/{p}" for p in packages]

        return packages
    except FileNotFoundError:
        print(
            "Error: pacman not found. Make sure Arch Linux is installed and pacman is in your PATH."
        )
        return []
    except subprocess.CalledProcessError as e:
        print(f"Error executing pacman: {e}")
        print(f"Stderr: {e.stderr}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []


def get_installed_packages():
    try:
        result = subprocess.run(
            ["pacman", "-Q"], capture_output=True, text=True, check=True
        )

        packages = [line.split(" ")[0] for line in result.stdout.splitlines()]
        return packages

    except:
        return []
