# Polygon Amoy Testnet Wallet

A lightweight, non-custodial React Native mobile wallet for the **Polygon Amoy testnet**. Built with security in mind: private keys are encrypted in device storage and protected by biometric authentication.

## 🚀 Features

- **Secure Key Storage**: Private keys encrypted in device secure storage (`expo-secure-store`)
- **Biometric Auth**: All sensitive operations (send, export) require fingerprint or face unlock
- **Real-time Balance**: Auto-refreshing balance every 15 seconds
- **Gas Fee Estimation**: Live gas cost calculation before sending transactions
- **QR Code Receive**: Easy share via QR code or text copy
- **Private Key Backup**: Protected export feature to prevent account loss
- **Block Explorer Links**: Direct links to Polygonscan for transaction confirmation

## 🛠️ Setup

### Prerequisites

- Node.js 16+
- Expo CLI: `npm install -g expo-cli`
- iOS/Android device or emulator

### Installation

```bash
git clone https://github.com/Adil386/polygon-amoy-testnet-wallet.git
cd polygon-amoy-testnet-wallet

# Install dependencies
npm install

# Start Expo
expo start

# Scan QR code on iOS/Android device or use emulator
```

### First Launch

1. App will prompt for biometric authentication
2. Private key auto-generates and stores securely on first run
3. You're ready to receive test POL tokens!

## 💰 Getting Test Tokens

Since this is a **testnet-only** wallet:

1. Navigate to the **Receive** tab
2. Copy your wallet address
3. Visit [Polygon Amoy Faucet](https://faucet.polygon.technology)
4. Paste your address and request test POL
5. Return to the app and tap **Refresh**

## 📱 How to Use

### Send POL

1. Tap **Send** tab
2. Enter recipient address (must be valid Ethereum address)
3. Enter amount in POL
4. Review gas fee estimate
5. Confirm with biometric authentication
6. Transaction will be broadcast to Polygon Amoy testnet

### Receive POL

1. Tap **Receive** tab
2. Share QR code or copy address directly

### Backup Your Key

1. Tap **Export** tab
2. Tap "Reveal Private Key (Biometric)"
3. Your private key appears (encrypted device storage key)
4. **Never share this key with anyone**
5. Store safely in a password manager or offline

## ⚙️ Configuration

Edit constants in `App.js`:

```javascript
const RPC = 'https://rpc-amoy.polygon.technology'; // Polygon Amoy RPC endpoint
const EXPLORER = 'https://amoy.polygonscan.com/tx/'; // Block explorer
const KEY = 'dev_wallet_pk'; // SecureStore key name
```

## 🔒 Security Notes

**CRITICAL: This is a testnet-only wallet. DO NOT use for mainnet or real funds.**

- ✅ Private keys stored encrypted on device
- ✅ Biometric unlock required for sensitive operations
- ✅ No remote servers or cloud backups
- ❌ Single private key (not MPC or multisig)
- ❌ No hardware wallet support
- ❌ Not audited for production use

For production wallets, use:
- MetaMask / Trust Wallet (mobile)
- Ledger / Trezor (hardware wallets)
- MultiSig solutions (Gnosis Safe)

See `SECURITY.md` for detailed security guidelines.

## 📊 Architecture

```
App.js
├── Home         (Balance display + quick actions)
├── Send         (Transaction form + gas estimation)
├── Receive      (QR code + address sharing)
└── Export       (Biometric-protected key backup)
```

**Dependencies:**
- `ethers.js` - Blockchain interactions
- `expo-secure-store` - Encrypted key storage
- `expo-local-authentication` - Biometric unlock
- `expo-haptics` - Haptic feedback
- `react-native-qrcode-svg` - QR generation

## 🐛 Known Limitations

1. **RPC Rate Limiting**: Public Polygon Amoy RPC may occasionally rate-limit. Consider using Alchemy/Infura with API keys for production use.
2. **No Gasless Transactions**: All sends require paying network fees from balance
3. **15-Second Polling**: Balance refresh interval is fixed (not user-configurable)
4. **No Transaction History**: Only current balance and real-time sends

## 🚦 Future Enhancements

- [ ] Transaction history & filtering
- [ ] Custom RPC endpoint configuration
- [ ] Multiple wallet support
- [ ] Offline transaction signing
- [ ] ERC-20 token support
- [ ] Gasless relay integration
- [ ] Dark mode toggle

## 📝 License

MIT

## 🤝 Contributing

Fork this repo and submit a PR for bug fixes or enhancements. Testnet improvements welcome!

---

**Disclaimer:** This wallet is provided as-is for educational and testnet purposes. Use at your own risk. The authors are not responsible for any loss of funds or security breaches.
