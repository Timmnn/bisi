# Check if yay is already installed
if ! command -v yay &> /dev/null; then
  echo "yay not found, installing..."
  # Install git and base-devel if not already installed
  sudo pacman -S --needed git base-devel

  # Remove existing yay directory if it exists to prevent errors
  if [ -d "./yay-bin" ]; then
    rm -r ./yay-bin
  fi

  # Clone yay-bin repository
  git clone https://aur.archlinux.org/yay-bin.git

  # Navigate into the directory
  cd yay-bin

  # Build and install yay
  makepkg -si

  # Navigate back to the parent directory
  cd ..

  # Clean up the yay-bin directory
  sudo rm -r ./yay-bin
else
  echo "yay is already installed."
fi
