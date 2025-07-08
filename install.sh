# Ensure the script exits if any command fails
set -e

# Install unzip and git using pacman
sudo pacman -Sy --noconfirm unzip git

# Install bun using its official installation script
curl -fsSL https://bun.sh/install | bash

# Ensure bun is in the PATH for the current script
# The bun installer usually adds it to ~/.bashrc or ~/.profile.
# To make it available immediately, we can source that file or
# explicitly add the bun binary path to the current session's PATH.
# A common install location for bun is ~/.bun/bin.
export PATH="/home/$USER/.bun/bin:$PATH"

# Clone the bisi repository
git clone https://github.com/Timmnn/bisi.git

# Navigate into the bisi directory
cd bisi

# Install bun dependencies for the bisi project
bun install

echo "Installation complete: unzip and bun are installed, and bisi repository is cloned."
