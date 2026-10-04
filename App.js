import 'react-native-get-random-values';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Share, ActivityIndicator, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuth from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';
import { ethers } from 'ethers';

// TESTNET ONLY: Polygon Amoy. Never put real funds in this dev wallet.
const RPC = 'https://rpc-amoy.polygon.technology';
const EXPLORER = 'https://amoy.polygonscan.com/tx/';
const KEY = 'dev_wallet_pk';
const C = { bg: '#0F172A', card: '#1E293B', ink: '#F1F5F9', mut: '#94A3B8', pri: '#3B82F6', gain: '#10B981', loss: '#EF4444' };
const provider = new ethers.JsonRpcProvider(RPC);

async function unlock(reason) {
  const has = await LocalAuth.hasHardwareAsync();
  const enrolled = await LocalAuth.isEnrolledAsync();
  if (!has || !enrolled) return true;
  const r = await LocalAuth.authenticateAsync({ promptMessage: reason });
  return r.success;
}

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('home');
  const [bal, setBal] = useState(null);

  useEffect(() => {
    (async () => {
      if (!(await unlock('Unlock wallet'))) return Alert.alert('Locked', 'Authentication failed. Restart the app.');
      let pk = await SecureStore.getItemAsync(KEY);
      if (!pk) { pk = ethers.Wallet.createRandom().privateKey; await SecureStore.setItemAsync(KEY, pk); }
      setWallet(new ethers.Wallet(pk, provider));
      setReady(true);
    })();
  }, []);

  const refresh = async () => {
    if (!wallet) return;
    try { setBal(ethers.formatEther(await provider.getBalance(wallet.address))); }
    catch { setBal('error'); }
  };

  useEffect(() => { 
    if (!wallet) return;
    refresh(); 
    const t = setInterval(refresh, 15000); 
    return () => clearInterval(t); 
  }, [wallet]);

  if (!ready) return <SafeAreaView style={s.c}><ActivityIndicator color={C.pri} style={{ marginTop: 80 }} /></SafeAreaView>;
  return (
    <SafeAreaView style={s.c}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, padding: 18 }}>
        {tab === 'home' && <Home bal={bal} wallet={wallet} setTab={setTab} refresh={refresh} />}
        {tab === 'send' && <Send wallet={wallet} refresh={refresh} done={() => setTab('home')} />}
        {tab === 'recv' && <Recv wallet={wallet} />}
        {tab === 'export' && <Export wallet={wallet} done={() => setTab('home')} />}
      </View>
      <View style={s.nav}>
        {[['home', 'Home'], ['send', 'Send'], ['recv', 'Receive'], ['export', 'Export']].map(([k, l]) => (
          <TouchableOpacity key={k} style={{ flex: 1, padding: 14 }} onPress={() => setTab(k)}>
            <Text style={{ textAlign: 'center', fontWeight: '700', color: tab === k ? C.pri : C.mut, fontSize: 12 }}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

function Home({ bal, wallet, setTab, refresh }) {
  return (
    <View>
      <Text style={s.mut}>Polygon Amoy testnet</Text>
      <Text style={s.big}>{bal === null ? '...' : bal === 'error' ? 'Network error' : Number(bal).toFixed(4) + ' POL'}</Text>
      <Text style={s.mut}>{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <Btn t="Send" onPress={() => setTab('send')} p />
        <Btn t="Receive" onPress={() => setTab('recv')} />
        <Btn t="Refresh" onPress={refresh} />
      </View>
      <View style={s.card}>
        <Text style={s.ink}>Need test POL?</Text>
        <Text style={s.mut}>Copy your address from Receive, then request free test tokens from the Polygon Amoy faucet (faucet.polygon.technology).</Text>
      </View>
      <Text style={[s.mut, { marginTop: 16, fontSize: 12 }]}>Dev wallet: a single key in secure storage. Not MPC, not production safe. Use Export tab to backup your key.</Text>
    </View>
  );
}

function Send({ wallet, refresh, done }) {
  const [to, setTo] = useState('');
  const [amt, setAmt] = useState('');
  const [busy, setBusy] = useState(false);
  const [gasEst, setGasEst] = useState(null);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  const validTo = ethers.isAddress(to);
  const n = parseFloat(amt);
  const ok = validTo && n > 0 && to.toLowerCase() !== wallet.address.toLowerCase();

  useEffect(() => {
    if (!ok || !to || !amt) { setGasEst(null); return; }
    (async () => {
      try {
        const feeData = await provider.getFeeData();
        const tx = {
          to,
          value: ethers.parseEther(amt),
          gasPrice: feeData.gasPrice,
        };
        const gasLimit = await provider.estimateGas(tx);
        const gasCost = gasLimit * feeData.gasPrice;
        if (isMountedRef.current) setGasEst(ethers.formatEther(gasCost));
        setError(null);
      } catch (e) {
        if (isMountedRef.current) {
          setGasEst(null);
          setError(e.message);
        }
      }
    })();
  }, [to, amt, ok]);

  const send = async () => {
    if (!(await unlock('Confirm payment'))) return;
    setBusy(true);
    try {
      const tx = await wallet.sendTransaction({ to, value: ethers.parseEther(amt) });
      await tx.wait();
      if (!isMountedRef.current) return;
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await refresh();
      Alert.alert('Sent', 'Transaction confirmed.\n' + EXPLORER + tx.hash, [{ text: 'OK', onPress: done }]);
    } catch (e) {
      if (isMountedRef.current) {
        Alert.alert('Send failed', String(e.shortMessage || e.message));
      }
    } finally { if (isMountedRef.current) setBusy(false); }
  };

  return (
    <View>
      <Text style={s.ink}>Send POL</Text>
      <TextInput style={s.in} placeholder="Recipient 0x..." placeholderTextColor={C.mut} value={to} onChangeText={setTo} autoCapitalize="none" autoCorrect={false} />
      {!!to && !validTo && <Text style={{ color: C.loss, marginTop: 6 }}>Not a valid address. Check every character.</Text>}
      <TextInput style={s.in} placeholder="Amount" placeholderTextColor={C.mut} value={amt} onChangeText={setAmt} keyboardType="decimal-pad" />
      {ok && gasEst && <Text style={[s.mut, { marginTop: 10, color: C.gain }]}>Gas fee estimate: {Number(gasEst).toFixed(6)} POL</Text>}
      {error && <Text style={[s.mut, { marginTop: 10, color: C.loss }]}>Fee estimation failed: {error}</Text>}
      {ok && <Text style={[s.mut, { marginTop: 10 }]}>Preview: {amt} POL to {to.slice(0, 6)}...{to.slice(-4)}</Text>}
      <View style={{ marginTop: 16 }}>{busy ? <ActivityIndicator color={C.pri} /> : <Btn t="Confirm with biometrics" p disabled={!ok} onPress={send} />}</View>
    </View>
  );
}

function Recv({ wallet }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={s.ink}>Receive on Polygon Amoy</Text>
      <View style={{ backgroundColor: '#fff', padding: 14, borderRadius: 14, marginTop: 16 }}><QRCode value={wallet.address} size={180} /></View>
      <Text style={[s.mut, { marginTop: 14, textAlign: 'center' }]} selectable>{wallet.address}</Text>
      <View style={{ marginTop: 14, width: '100%' }}><Btn t="Share address" onPress={() => Share.share({ message: wallet.address })} /></View>
    </View>
  );
}

function Export({ wallet, done }) {
  const [pkVisible, setPkVisible] = useState(false);
  const [pk, setPk] = useState(null);

  const reveal = async () => {
    if (!(await unlock('Reveal private key'))) return Alert.alert('Failed', 'Authentication required.');
    const stored = await SecureStore.getItemAsync(KEY);
    if (stored) {
      setPk(stored);
      setPkVisible(true);
    }
  };

  return (
    <View>
      <Text style={s.ink}>Backup Private Key</Text>
      <View style={s.card}>
        <Text style={{ color: C.loss, fontWeight: '700' }}>⚠️ WARNING</Text>
        <Text style={s.mut}>Anyone with your private key can steal all funds. Never share it. Never paste it in unsecured places.</Text>
      </View>
      {!pkVisible ? (
        <Btn t="Reveal Private Key (Biometric)" p onPress={reveal} />
      ) : (
        <>
          <Text style={[s.mut, { marginTop: 16, fontSize: 12 }]} selectable>{pk}</Text>
          <Btn t="Copy to Clipboard" onPress={() => { Share.share({ message: pk }).then(() => setPkVisible(false)); }} />
          <Btn t="Done" onPress={done} />
        </>
      )}
    </View>
  );
}

const Btn = ({ t, onPress, p, disabled }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={[s.btn, p && { backgroundColor: C.pri }, disabled && { opacity: 0.4 }, { marginTop: 12 }]}>
    <Text style={{ color: C.ink, fontWeight: '700', textAlign: 'center' }}>{t}</Text>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.bg },
  big: { fontSize: 34, fontWeight: '800', color: C.ink, marginVertical: 6 },
  ink: { color: C.ink, fontSize: 18, fontWeight: '700' },
  mut: { color: C.mut, fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginTop: 20, gap: 6 },
  btn: { flex: 1, backgroundColor: C.card, padding: 14, borderRadius: 14 },
  in: { backgroundColor: C.card, color: C.ink, padding: 14, borderRadius: 12, marginTop: 12, fontSize: 16 },
  nav: { flexDirection: 'row', backgroundColor: C.card },
});
