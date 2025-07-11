#!/bin/bash

# Define VM parameters
VM_NAME="arch-vm"
RAM_MB=4096
CPU_CORES=2
DISK_GB=30
ISO_PATH="/home/timm/ISOs/archlinux-2025.07.01-x86_64.iso" # !!! REPLACE THIS WITH THE ACTUAL PATH TO YOUR ARCH LINUX ISO !!!
BRIDGE_NAME="virbr0" # Or your desired bridge name

# Check if the ISO path is set
if [ ! -f "$ISO_PATH" ]; then
    echo "Error: Arch Linux ISO not found at $ISO_PATH"
    echo "Please update the ISO_PATH variable in the script."
    exit 1
fi

# Create a disk image for the VM
echo "Creating a ${DISK_GB}GB qcow2 disk image..."
qemu-img create -f qcow2 "/var/lib/libvirt/images/${VM_NAME}.qcow2" "${DISK_GB}G"

# Build the virt-install command
echo "Creating the virtual machine with virt-install..."
virt-install \
    --name "${VM_NAME}" \
    --ram "${RAM_MB}" \
    --vcpus "${CPU_CORES}" \
    --disk path="/var/lib/libvirt/images/${VM_NAME}.qcow2",format=qcow2 \
    --os-variant archlinux \
    --network bridge="${BRIDGE_NAME}",model=virtio \
    --graphics spice,listen=auto \
    --noautoconsole \
    --cdrom "${ISO_PATH}" \
    --boot cdrom,hd \
    --rng /dev/urandom \
    --sound hw \
    --video qxl \
    --channel spicevmc \
    --connect qemu:///system

echo "VM creation process initiated. You can connect to the console using 'virt-viewer -c qemu:///system ${VM_NAME}' or manage it with 'virsh'."
