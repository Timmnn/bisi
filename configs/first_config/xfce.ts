export default [
  {
    name: "xorg",
    groupInstall: "all",
    postInstall: "sudo systemctl enable lightdm.service",
  },
  {
    name: "extra/lightdm",
    postInstall: "sudo systemctl enable lightdm.service",
  },
];
