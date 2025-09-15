# Blazar Terminal - Quick Start Guide

## Quick Setup (5 minutes)

### 1. Prerequisites

- Raspberry Pi Zero 2W with Raspberry Pi OS
- Node.js 16+ installed
- Bluetooth enabled

### 2. Installation

```bash
# Install dependencies
npm install

# Configure Bluetooth permissions
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
sudo usermod -a -G bluetooth $USER
```

### 3. Configuration

Edit `src/services.js` to set your API endpoint:

```javascript
const API_BASE_URL = "http://your-api-server:5000";
```

### 4. Run

```bash
npm run dev
```

## Testing

### 1. Check BLE Advertising

```bash
sudo hcitool lescan
# Look for "Hydra TERM" device
```

### 2. Test WebSocket Connection

```javascript
const io = require("socket.io-client");
const socket = io("http://localhost:3000");

socket.emit("requestFunds", {
  address: "addr1...",
  amount: 10.5,
  decimals: 6,
  assetUnit: "lovelace",
});
```

### 3. Monitor Logs

```bash
# Check application logs
tail -f /var/log/syslog | grep hydra

# Or run with verbose logging
DEBUG=* node src/index.js
```

## Common Commands

```bash
# Start service
npm run dev

# Check Bluetooth status
sudo systemctl status bluetooth

# Restart Bluetooth
sudo systemctl restart bluetooth

# Check BLE devices
sudo hcitool lescan

# Monitor network
netstat -tulpn | grep :3000
```

## Troubleshooting

| Issue                    | Solution                                    |
| ------------------------ | ------------------------------------------- |
| BLE not advertising      | `sudo systemctl restart bluetooth`          |
| Permission denied        | `sudo setcap cap_net_raw+eip $(which node)` |
| API connection failed    | Check `API_BASE_URL` in `services.js`       |
| WebSocket not connecting | Verify port 3000 is available               |

## BLE Characteristics

| UUID                                   | Name             | Type  | Purpose                    |
| -------------------------------------- | ---------------- | ----- | -------------------------- |
| `a781af9a-9a04-4422-9d78-9014497ccdc0` | Merchant Address | Read  | Merchant's Cardano address |
| `61b64163-35fa-438a-810c-018d1a719667` | Payment Amount   | Read  | Amount in smallest unit    |
| `52f34145-0363-4f4e-9fab-a133e8e5b0b1` | Asset Unit       | Read  | Asset identifier           |
| `9b16159d-7c3e-4ae6-990b-0d34f22389bb` | Client Address   | Write | Client's Cardano address   |

## WebSocket Events

### Outgoing (Terminal → Merchant)

- `payed`: Payment completed with details

### Incoming (Merchant → Terminal)

- `requestFunds`: Initiate payment request
- `disconnect`: Handle disconnection

## API Endpoints

- `GET /query-funds?address={clientAddress}` - Query client funds
- `POST /pay-merchant` - Process payment

For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)
