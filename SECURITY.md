# Security Guidelines

## ⚠️ TESTNET ONLY

**This wallet is designed for Polygon Amoy testnet ONLY. Never use with mainnet or real funds.**

If you accidentally send real funds to this wallet, they cannot be recovered through standard means.

---

## 🔐 Key Storage & Protection

### How Your Private Key is Stored

1. **On First Launch**: App generates a random private key using `ethers.Wallet.createRandom()`
2. **Encryption**: Key is immediately encrypted and stored in device secure storage
   - **iOS**: Stored in Keychain with encryption
   - **Android**: Stored in Keystore with encryption
3. **Biometric Lock**: Every access to the key requires biometric authentication (Face ID / Touch ID)

### Private Key Access Points

- **Send Transaction** (biometric required): Needed to sign the transaction
- **Export Key** (biometric required): Allows you to backup your key to a secure location

### What We DON'T Do

- ❌ Send keys to remote servers
- ❌ Log or store keys in plain text
- ❌ Store keys in app preferences or local storage
- ❌ Backup keys to cloud services automatically
- ❌ Display keys without explicit biometric consent

---

## 🚨 Critical Security Rules

### 1. Never Share Your Private Key

Your private key is like a master password for your wallet. **Anyone** with this key can:
- Transfer all funds out
- Sign transactions in your name
- Drain your account

**Rule**: Never paste your private key in:
- Chat messages or emails
- Screenshots or photos
- Unsecured text files
- Web forms or websites (except cold storage solutions)

### 2. Use Strong Device Security

- Set a strong device PIN/password (not just swipe pattern)
- Enable biometric unlock (Face ID / Touch ID)
- Keep your OS updated with security patches
- Don't jailbreak/root your device
- Use a trusted device (not shared, not compromised)

### 3. Be Careful with Testnet "Recovery Phrases"

Unlike production wallets with seed phrases, this wallet uses a **single private key**:
- No recovery phrase is generated
- No mnemonic words to write down
- Backup your private key using the **Export** tab
- Store the exported key in a password manager (e.g., 1Password, LastPass)

### 4. Verify Recipient Addresses

**Always double-check** before sending:
- Copy the recipient address from a trusted source
- Don't rely on clipboard data (malware can swap it)
- Verify the first 6 and last 4 characters match
- If sending to an exchange or service, verify on their official website

### 5. Monitor Gas Fees

The app shows a **gas fee estimate** before sending:
- Standard Polygon gas is typically < 0.001 POL
- Excessive gas estimates may indicate network congestion
- Cancel and retry if fees seem unreasonable

---

## 🛡️ Protecting Against Common Attacks

### Attack: Device Theft

**Protection**:
- Biometric unlock is required for every sensitive operation
- If your device is stolen, your funds are protected by device lock screen + biometric
- Revoke the private key by exporting it and deleting the app locally

**If Compromised**:
1. Export your private key immediately (if you still have access)
2. Create a new wallet
3. Transfer all funds to the new wallet
4. Delete the app from the compromised device

### Attack: Clipboard Hijacking

**Protection**:
- The app does NOT auto-copy your address
- You manually copy via Share or clipboard (explicit action)
- Mobile malware can't intercept unless the device itself is compromised

### Attack: Fake Faucets / Phishing

**Protection**:
- Only use official Polygon Amoy Faucet: https://faucet.polygon.technology
- Verify the SSL certificate (green lock in browser)
- Never enter your private key anywhere
- Never click links from untrusted sources

### Attack: Man-in-the-Middle (MITM)

**Protection**:
- All RPC calls use HTTPS (encrypted in transit)
- App does NOT use custom HTTP endpoints by default
- If you configure a custom RPC, ensure it's HTTPS with valid SSL

---

## 🔄 Wallet Recovery & Backups

### Recommended Backup Strategy

1. **On First Launch**: Export your private key via the **Export** tab
2. **Store Safely**: Save it in a password manager (1Password, Bitwarden, LastPass)
   - Encrypted: ✅ (password manager handles encryption)
   - Backed up: ✅ (synced across your devices)
   - Accessible: ✅ (only with master password)
3. **Alternative**: Write it down on paper and store in a safe
   - Secure: ✅ (not digital)
   - Accessible: ⚠️ (requires physical access)
   - Backup: ❌ (single point of failure)

### Reinstalling the App

If you uninstall and reinstall:
1. App will generate a **new private key**
2. Your old funds will be in your **old wallet address**
3. To recover:
   - Use your backed-up private key from Export
   - Or use a multi-chain wallet (MetaMask) with the old key

---

## ✅ Security Checklist

Before using this wallet:

- [ ] I understand this is for **Polygon Amoy testnet ONLY**
- [ ] I will NOT use real funds in this wallet
- [ ] My device has a strong lock (PIN or biometric)
- [ ] I have enabled Face ID or Touch ID
- [ ] I will back up my private key immediately after first launch
- [ ] I understand private keys are like passwords—never share them
- [ ] I will verify recipient addresses before sending
- [ ] I will never paste my private key into websites or messages
- [ ] I have read the CRITICAL security warnings above

---

## 🆘 If Something Goes Wrong

### My balance shows "Network error"

- Check your internet connection
- Public Polygon Amoy RPC may be rate-limited
- Try again in 30 seconds
- For persistent issues, configure an Alchemy or Infura RPC endpoint

### I sent a transaction and it's stuck

- Transactions on Amoy typically confirm in 1-5 minutes
- Check the block explorer: https://amoy.polygonscan.com
- Search for your wallet address
- If still pending after 10 minutes, the RPC may be slow

### I lost my private key

- **If exported and backed up**: Recover from your password manager
- **If NOT backed up**: Your testnet funds are still in the wallet address
  - Use MetaMask or another wallet to import the private key
  - Or reinstall this app (it will generate a new key for new funds)

### I think my device is compromised

1. **Immediately** export your private key
2. Create a fresh wallet on a clean device
3. Transfer all funds to the new wallet
4. Factory reset the compromised device
5. Reinstall the wallet on the clean device

---

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** post it publicly on GitHub Issues
2. **Email** the maintainer privately with:
   - Detailed description of the vulnerability
   - Steps to reproduce
   - Potential impact

---

## 🎓 Learning Resources

- [Ethereum Security Best Practices](https://ethereum.org/en/security/)
- [MetaMask Security Guide](https://metamask.io/security/)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-top-10/)
- [Polygon Documentation](https://polygon.technology/)

---

**Last Updated**: October 2026

**Disclaimer**: This security guide is provided as-is. The authors are not responsible for any loss of funds due to user error, device compromise, or unforeseen vulnerabilities. Use at your own risk.
