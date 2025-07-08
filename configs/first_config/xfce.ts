export default [
  {
    name: "xorg",
    groupInstall: "all",
    postInstall: "sudo systemctl enable lightdm.service",
  },

  {
    name: "xfce4",
    groupInstall: "all",
  },

  {
    name: "xfce4-goodies",
    groupInstall: "all",
  },

  {
    name: "lightdm-gtk-greeter",
  },

  {
    name: "extra/lightdm",
    postInstall: "sudo systemctl enable lightdm.service",
  },
];
