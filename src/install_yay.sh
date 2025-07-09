if ! command -v yay &> /dev/null; then
  echo "yay not found, installing..."
  sudo pacman -S --needed git base-devel
  if [ -d "./yay-bin" ]; then
    rm -r ./yay-bin
  fi

  git clone https://aur.archlinux.org/yay-bin.git

  cd yay-bin

  makepkg -si

  cd ..

  sudo rm -r ./yay-bin
else
  echo "yay is already installed."
fi
