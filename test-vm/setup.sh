sudo pacman -Sy archlinux-keyring
sudo pacman -Syu --noconfirm

cd /opt/bisi/
sudo pacman -S uv --noconfirm
uv venv
source ./.venv/bin/activate
rm active_config.json || 1
yes | ./bisi cli apply
