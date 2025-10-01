# IoT Device – Onboarding & Installation (Raspberry Pi Zero 2W)

This guide describes how to prepare a Raspberry Pi Zero 2W to run as a managed AP + Wi-Fi client (AP-STA) for first-time onboarding, while also installing a Node.js application.

## Prerequisites

### Hardware

- Raspberry Pi Zero 2 W
- microSD card (≥ 8 GB) + card reader
- 5.1V @ 2.5A power supply (battery or adapter)

### OS

- Raspberry Pi OS Lite (Bookworm), 64-bit, no desktop

### Network & Tools

- Local Wi-Fi SSID & password (2.4 GHz recommended)
- A computer with SSH client

### Runtime

- Node.js ≥ 18 and npm (will be installed on the Pi)

### RaspAP

- We’ll follow the AP-STA (experimental) 15-step flow from RaspAP’s [DOCS](https://docs.raspap.com/features-experimental/ap-sta/)

## Flash Raspberry Pi OS (Lite)

1. Flash the SD with the latest Raspberry Pi OS Lite (64-bit). I recommend using the official raspberry pi imager since it will give a list of OSs to choose from [RBPI Imager](https://www.raspberrypi.com/software/).

2. Before writing the image, make sure to use the pi imager installation settings to setup the hostname for your device, I recommend to use `blazar` as the host name, set username and password, suggested username `blazar`. You can also setup a wifi ssid and password to connect to by default. We recommend to setup your office or lab's wifi network since it will make accessing the device easier for the rest of the installation process.

3. Choose the locale, hopefully the selected Locale obeys the locale of the merchant that will receive the device.

4. Once the image is burned. Insert SD into the Pi Zero 2W and power on with a 5.1V/2.5A supply.

## Access the Raspberry Pi via SSH

In theory, you should be able to shh using the hostname on the device:

```bash
ssh blazar@blazar.local
```

If this down't work, then follow these steps:

1. First you need to figure out what the IP address of the raspberry pi is. We recommend using a network scanner tool, any should do. We use [nmap](https://nmap.org/) for the job. We start by searching for the router's IP. In linux:

```bash
ifconfig
```

We get an output as such. We can see our wireles interface on the range of `192.168.0.XXX`

```bash
wlp2s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.100  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::80aa:927e:91dd:c38f  prefixlen 64  scopeid 0x20<link>
        ether e0:2b:e9:13:56:6e  txqueuelen 1000  (Ethernet)
        RX packets 14849252  bytes 19180891516 (19.1 GB)
        RX errors 0  dropped 386  overruns 0  frame 0
        TX packets 3230327  bytes 639047938 (639.0 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

2. Next we scan the network using NMAP.

```bash
nmap -sP 192.168.0.0/24
```

On the result list, you will find the device's IP address.

3. Now we can ssh into the device:

```bash
ssh blazar@192.168.0.XXX
```

Replace XXX with your device's number.

Another easy way to avoid all these steps is to connect a screen and keyboard to the rasoberry pi using an mini HDMI to HDMI cable and a keyboard with a micro-usb cable.

Once inside the device, we proceed to install RaspAP.

```bash
sudo apt-get update
sudo apt-get full-upgrade
sudo reboot
```

Once up and running again after the reboot:

Set the WiFi country in raspi-config's Localisation Options:

```bash
sudo raspi-config
```

Invoke RaspAP's Quick Installer:

```bash
curl -sL https://install.raspap.com | bash
```

## Initial settings

After completing either of these setup options, the wireless AP network will be configured as follows:

- IP address: 10.3.141.1
- Username: admin
- Password: secret
- DHCP range: 10.3.141.50 — 10.3.141.254
- SSID: RaspAP
- Password: ChangeMe

It is strongly recommended that you change these default credentials in RaspAP's Authentication and Hotspot > Security panels.

Your AP's basic settings and many advanced options may now be modified by RaspAP.

## Configure RaspAP to meet Blazar Pay Terminal requirenment

1. On the dashboard, go to **Hotspot -> Basic** and change the SSID to `BlazarPay`, this will be the name of the soft spot for this device.

2. On the **Hotspot -> Security** tab, you can change the Pre-shared key (psk) if you wish. Make sure to Save Settings on modifications.

3. Follow [steps 8 to 15](https://docs.raspap.com/features-experimental/ap-sta/#installation) in order to setup the software AP-STA mode (very important).
