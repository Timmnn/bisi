export default [
  {
    name: "extra/lightdm",
    postInstall: "sudo systemctl enable lightdm.service",
  },

  "extra/lightdm",
  {
    name: "xorg",
    groupInstall: "all",
    postInstall: "sudo systemctl enable lightdm.service",
  },
];
