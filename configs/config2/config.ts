import { AurHelper, Pkg, Service, type Config } from '../../src/config_utils'
import basic_packages from './basic_packages'
import kde from './kde'
import { pkg } from './utils'

export default {
  aur_helper: AurHelper.yay,
  packages: [
    ...basic_packages,
    //...kde.packages,
    pkg('extra/virtualbox'),
    new Pkg({
      name: 'virtualbox-host-modules-arch',
      postInstall: `sudo gpasswd -a timm vboxusers; sudo modprobe vboxdrv; echo -e 'SUBSYSTEM=="usb_device", GROUP="vboxusers", MODE="0664"\nSUBSYSTEM=="usb", ENV{DEVTYPE}=="usb_device", MODE="0664", GROUP="vboxusers"' | sudo tee /etc/udev/rules.d/60-vboxusers.rules`,
    }),
    pkg('virtualbox-host-modules-arch'),
    pkg('extra/btop'),
    /* After installing, add 
    # Blacklist KVM modules to prevent conflicts with VirtualBox
    blacklist kvm-amd
    blacklist kvm-intel
    
    to /etc/modprobe.d/blacklist-kvm.conf

    then run 'sudo mkinitcpio -P' and reboot
    */
  ],
  services: [, /*...kde.services*/ new Service({ name: 'bluetooth.service' })],
} satisfies Config
