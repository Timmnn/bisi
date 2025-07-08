# Ensure the script exits if any command fails
set -e

# Install unzip based on the operating system
if command -v apt-get &> /dev/null; then
  # Debian/Ubuntu
  sudo apt-get update
  sudo apt-get install -y unzip
elif command -v dnf &> /dev/null; then
  # Fedora/RHEL
  sudo dnf install -y unzip
elif command -v pacman &> /dev/null; then
  # Arch Linux
  sudo pacman -Sy --noconfirm unzip
elif command -v brew &> /dev/null; then
  # macOS with Homebrew
  brew install unzip
else
  echo "Error: Could not determine package manager to install unzip."
  exit 1
fi

# Install bun using its official installation script
curl -fsSL https://bun.sh/install | bash

# Clone the bisi repository
git clone https://github.com/Timmnn/bisi.git



echo "Installation complete: unzip and bun are installed, and bisi repository is cloned."
