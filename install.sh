# Ensure the script exits if any command fails
set -e

sudo pacman -Sy --noconfirm unzip git

# Install bun using its official installation script
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc


# Clone the bisi repository
git clone https://github.com/Timmnn/bisi.git

cd bisi;
bun install



echo "Installation complete: unzip and bun are installed, and bisi repository is cloned."
