import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props { activeTab: 'learn' | 'play' }

async function generateRSA() {
  return await window.crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['encrypt', 'decrypt']
  ) as CryptoKeyPair;
}

async function rsaEncrypt(publicKey: CryptoKey, text: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, enc.encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

async function rsaDecrypt(privateKey: CryptoKey, b64: string): Promise<string> {
  const buf = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const plain = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, buf);
  return new TextDecoder().decode(plain);
}

export function RSALearn() {
  return (
    <div className="space-y-6">
      <div className="bg-purple-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">What is RSA?</h3>
        <p className="font-bold text-sm leading-relaxed">
          <strong>RSA</strong> (Rivest–Shamir–Adleman, 1977) is the world's most widely used asymmetric cipher.
          It relies on the hardness of <strong>integer factorization</strong>: multiplying two large primes is easy,
          but factoring the result is computationally infeasible for classical computers.
        </p>
      </div>

      {/* Key Generation Steps */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-4">Key Generation (5 Steps)</h3>
        <div className="space-y-3">
          {[
            { n: '1', title: 'Choose two large primes', formula: 'p, q (each ~1024 bits for RSA-2048)', color: 'bg-yellow-100' },
            { n: '2', title: 'Compute modulus', formula: 'n = p × q', color: 'bg-cyan-100' },
            { n: '3', title: 'Compute totient', formula: 'φ(n) = (p−1)(q−1)', color: 'bg-pink-100' },
            { n: '4', title: 'Choose public exponent', formula: 'e: gcd(e, φ(n)) = 1  (usually 65537)', color: 'bg-green-100' },
            { n: '5', title: 'Compute private exponent', formula: 'd: e×d ≡ 1 (mod φ(n))  — modular inverse', color: 'bg-purple-100' },
          ].map(s => (
            <div key={s.n} className={`${s.color} border-2 border-black p-3 rounded-xl flex gap-3 items-start`}>
              <span className="font-black text-2xl w-8 shrink-0 text-center">{s.n}</span>
              <div>
                <div className="font-black text-sm">{s.title}</div>
                <code className="text-xs font-mono">{s.formula}</code>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-cyan-300 border-2 border-black p-3 rounded-xl text-center">
            <div className="font-black text-xs uppercase">Public Key</div>
            <code className="text-sm font-mono">(e, n)</code>
          </div>
          <div className="bg-pink-300 border-2 border-black p-3 rounded-xl text-center">
            <div className="font-black text-xs uppercase">Private Key</div>
            <code className="text-sm font-mono">(d, n)</code>
          </div>
        </div>
      </div>

      {/* Encrypt / Decrypt formulas */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-cyan-200 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          <h3 className="font-black uppercase mb-2">Encryption</h3>
          <code className="text-sm font-mono block bg-white border-2 border-black p-2 rounded-lg">C = Mᵉ mod n</code>
          <p className="text-xs font-bold mt-2">Anyone with the public key (e, n) can encrypt.</p>
        </div>
        <div className="bg-pink-200 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          <h3 className="font-black uppercase mb-2">Decryption</h3>
          <code className="text-sm font-mono block bg-white border-2 border-black p-2 rounded-lg">M = Cᵈ mod n</code>
          <p className="text-xs font-bold mt-2">Only the holder of the private key (d, n) can decrypt.</p>
        </div>
      </div>

      {/* OAEP padding */}
      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">OAEP Padding (Why It Matters)</h3>
        <p className="font-bold text-sm">
          Textbook RSA (Mᵉ mod n) is deterministic and malleable — the same plaintext always produces the same ciphertext.
          <strong> OAEP</strong> (Optimal Asymmetric Encryption Padding) randomizes the message before encryption, preventing
          chosen-ciphertext attacks. Always use <code className="bg-black text-yellow-300 px-1">RSA-OAEP</code>, never "raw" RSA.
        </p>
      </div>

      {/* Limitations */}
      <div className="bg-red-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Limitations & Quantum Threat</h3>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ RSA-2048 can only encrypt ~214 bytes (limited by modulus size minus padding)</li>
          <li>→ Typically used to encrypt a symmetric key, which then encrypts the actual data (hybrid encryption)</li>
          <li>→ Shor's algorithm on a sufficiently large quantum computer breaks RSA in polynomial time</li>
          <li>→ Recommended migration: CRYSTALS-Kyber (key exchange) + AES-256-GCM (data encryption)</li>
        </ul>
      </div>
    </div>
  );
}

export function RSAPlay() {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [message, setMessage] = useState('Hello, RSA!');
  const [ciphertext, setCiphertext] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'idle' | 'keygen' | 'encrypt' | 'decrypt'>('idle');

  const handleGenKeys = async () => {
    setLoading(true); setError(''); setCiphertext(''); setDecrypted(''); setStep('keygen');
    try {
      const kp = await generateRSA();
      setKeyPair(kp);
      setStep('encrypt');
    } catch {
      setError('Key generation failed.');
    }
    setLoading(false);
  };

  const handleEncrypt = async () => {
    if (!keyPair) return;
    setLoading(true); setError(''); setCiphertext(''); setDecrypted('');
    try {
      const ct = await rsaEncrypt(keyPair.publicKey, message);
      setCiphertext(ct);
      setStep('decrypt');
    } catch {
      setError('Encryption failed. Message may be too long (max ~190 bytes for RSA-2048-OAEP-SHA256).');
    }
    setLoading(false);
  };

  const handleDecrypt = async () => {
    if (!keyPair || !ciphertext) return;
    setLoading(true); setError('');
    try {
      const plain = await rsaDecrypt(keyPair.privateKey, ciphertext);
      setDecrypted(plain);
    } catch {
      setError('Decryption failed.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-purple-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        <strong>Real RSA-2048-OAEP</strong> via Web Crypto API. Key generation happens in the browser — no server involved.
      </div>

      {/* Step indicators */}
      <div className="flex gap-2">
        {[
          { s: 'keygen', label: '1. Generate Keys' },
          { s: 'encrypt', label: '2. Encrypt' },
          { s: 'decrypt', label: '3. Decrypt' },
        ].map(({ s, label }) => (
          <div key={s} className={`flex-1 py-2 text-center text-xs font-black uppercase border-2 border-black rounded-xl
            ${step === s ? 'bg-black text-yellow-300' : 'bg-white'}`}>
            {label}
          </div>
        ))}
      </div>

      <button onClick={handleGenKeys} disabled={loading}
        className="w-full py-4 bg-purple-400 border-4 border-black font-black uppercase text-sm disabled:opacity-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        {loading && step === 'keygen' ? 'Generating…' : keyPair ? 'Re-Generate RSA-2048 Key Pair' : 'Generate RSA-2048 Key Pair'}
      </button>

      {keyPair && (
        <div className="bg-green-100 border-4 border-black p-3 rounded-xl font-bold text-sm">
          ✓ RSA-2048 key pair ready (public + private key in memory)
        </div>
      )}

      <div>
        <label className="block font-black uppercase text-sm mb-1">Message (max ~190 bytes)</label>
        <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-purple-400 resize-none rounded-xl" />
        <p className="text-xs font-bold mt-1 text-black/60">{message.length} / 190 bytes</p>
      </div>

      <button onClick={handleEncrypt} disabled={loading || !keyPair}
        className="w-full py-4 bg-cyan-400 border-4 border-black font-black uppercase text-sm disabled:opacity-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        {loading && step === 'decrypt' ? '' : 'Encrypt with Public Key'}
      </button>

      {ciphertext && (
        <>
          <div>
            <label className="block font-black uppercase text-sm mb-1">Ciphertext (base64)</label>
            <textarea rows={4} value={ciphertext} readOnly
              className="w-full px-4 py-3 border-4 border-black bg-purple-100 font-mono text-xs resize-none rounded-xl" />
          </div>
          <button onClick={handleDecrypt} disabled={loading}
            className="w-full py-4 bg-pink-400 border-4 border-black font-black uppercase text-sm disabled:opacity-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
            Decrypt with Private Key
          </button>
        </>
      )}

      {decrypted && (
        <div className="bg-green-200 border-4 border-black p-4 rounded-xl">
          <label className="block font-black uppercase text-sm mb-1">Decrypted Message</label>
          <div className="font-bold">{decrypted}</div>
        </div>
      )}

      {error && <div className="bg-red-300 border-4 border-black p-4 font-bold rounded-xl">{error}</div>}
    </div>
  );
}

export default function RSAPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <RSALearn /> : <RSAPlay />}
    </motion.div>
  );
}
