export default [
  {
    name: "xorg",
  },

  {
    name: "xfce4",
  },

  {
    name: "xfce4-goodies",
  },

  {
    name: "extra/lightdm-gtk-greeter",
  },

  {
    name: "extra/lightdm",
    postInstall: "sudo systemctl enable lightdm.service",
  },
];
