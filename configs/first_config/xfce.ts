export default [
  "extra/xorg",
  "extra/xfce4",
  "extra/xfce4-goodies",
  "extra/lightdm-gtk-greeter",
  {
    name: "extra/lightdm",
    postInstall: "sudo systemctl enable lightdm.service",
  },
];
