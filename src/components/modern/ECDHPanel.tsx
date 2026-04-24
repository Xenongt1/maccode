import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import StepPlayer, { CipherStep } from './StepPlayer';

const ECDH_STEPS: CipherStep[] = [
  {
    title: 'The Elliptic Curve',
    visual: (
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="-4 -3 8 6" className="w-full max-w-[200px] border-2 border-black rounded-xl bg-gray-50" style={{ height: 140 }}>
          <line x1="-3.8" y1="0" x2="3.8" y2="0" stroke="black" strokeWidth="0.05" />
          <line x1="0" y1="-2.8" x2="0" y2="2.8" stroke="black" strokeWidth="0.05" />
          <path d="M -1.3 -0.5 C -0.8 -1.8 0 -2.2 0.8 -2.0 C 1.4 -1.8 2.2 -1.0 2.8 0.3" stroke="#6366f1" strokeWidth="0.08" fill="none" />
          <path d="M -1.3 0.5 C -0.8 1.8 0 2.2 0.8 2.0 C 1.4 1.8 2.2 1.0 2.8 -0.3" stroke="#6366f1" strokeWidth="0.08" fill="none" />
          <circle cx="0.5" cy="-1.9" r="0.15" fill="#0ea5e9" />
          <text x="0.7" y="-2.0" fontSize="0.28" fontWeight="bold" fill="#0ea5e9">G</text>
        </svg>
        <div className="text-xs font-bold">y² = x³ + ax + b</div>
      </div>
    ),
    explanation: "An elliptic curve is a set of points satisfying a simple equation. We choose a base point G on the curve — the starting point for all computations.",
  },
  {
    title: "Alice's Key Pair",
    visual: (
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="-4 -3 8 6" className="w-full max-w-[200px] border-2 border-black rounded-xl bg-gray-50" style={{ height: 130 }}>
          <path d="M -1.3 -0.5 C -0.8 -1.8 0 -2.2 0.8 -2.0 C 1.4 -1.8 2.2 -1.0 2.8 0.3" stroke="#6366f1" strokeWidth="0.08" fill="none" />
          <path d="M -1.3 0.5 C -0.8 1.8 0 2.2 0.8 2.0 C 1.4 1.8 2.2 1.0 2.8 -0.3" stroke="#6366f1" strokeWidth="0.08" fill="none" />
          <circle cx="0.5" cy="-1.9" r="0.13" fill="#0ea5e9" /><text x="0.7" y="-1.85" fontSize="0.25" fontWeight="bold" fill="#0ea5e9">G</text>
          <circle cx="1.8" cy="-1.3" r="0.15" fill="#06b6d4" /><text x="2.0" y="-1.25" fontSize="0.25" fontWeight="bold" fill="#06b6d4">aG</text>
        </svg>
        <div className="flex gap-2">
          <div className="bg-cyan-300 border-2 border-black px-2 py-1 rounded font-black text-xs flex items-center gap-1"><Lock size={10} /> secret a</div>
          <div className="bg-cyan-200 border-2 border-black px-2 py-1 rounded font-black text-xs">→ Public aG</div>
        </div>
      </div>
    ),
    explanation: "Alice picks secret integer a and computes aG by repeated point addition on the curve. aG is her public key — she sends it to Bob.",
  },
  {
    title: "Bob's Key Pair",
    visual: (
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="-4 -3 8 6" className="w-full max-w-[200px] border-2 border-black rounded-xl bg-gray-50" style={{ height: 130 }}>
          <path d="M -1.3 -0.5 C -0.8 -1.8 0 -2.2 0.8 -2.0 C 1.4 -1.8 2.2 -1.0 2.8 0.3" stroke="#6366f1" strokeWidth="0.08" fill="none" />
          <path d="M -1.3 0.5 C -0.8 1.8 0 2.2 0.8 2.0 C 1.4 1.8 2.2 1.0 2.8 -0.3" stroke="#6366f1" strokeWidth="0.08" fill="none" />
          <circle cx="0.5" cy="-1.9" r="0.13" fill="#0ea5e9" /><text x="0.7" y="-1.85" fontSize="0.25" fontWeight="bold" fill="#0ea5e9">G</text>
          <circle cx="2.3" cy="-0.7" r="0.15" fill="#ec4899" /><text x="2.5" y="-0.65" fontSize="0.25" fontWeight="bold" fill="#ec4899">bG</text>
        </svg>
        <div className="flex gap-2">
          <div className="bg-pink-300 border-2 border-black px-2 py-1 rounded font-black text-xs flex items-center gap-1"><Lock size={10} /> secret b</div>
          <div className="bg-pink-200 border-2 border-black px-2 py-1 rounded font-black text-xs">→ Public bG</div>
        </div>
      </div>
    ),
    explanation: "Bob picks secret integer b and computes bG. He sends bG to Alice. Eve can see aG and bG on the wire but cannot reverse point multiplication.",
  },
  {
    title: 'Shared Secret abG',
    visual: (
      <div className="space-y-2 w-full max-w-xs mx-auto">
        <div className="bg-cyan-200 border-4 border-black px-4 py-2 rounded-xl font-bold text-sm">Alice: a × (bG) = <strong>abG</strong></div>
        <div className="bg-pink-200 border-4 border-black px-4 py-2 rounded-xl font-bold text-sm">Bob: b × (aG) = <strong>baG</strong></div>
        <div className="bg-green-300 border-4 border-black px-4 py-3 rounded-xl font-black text-sm text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">abG = baG ✓ Same point!</div>
        <div className="text-xs font-bold text-center text-black/60">x-coordinate of abG = shared secret</div>
      </div>
    ),
    explanation: "Both arrive at the same point abG on the curve. The x-coordinate of this point is the shared secret, used as an AES key.",
  },
  {
    title: 'Key Size Advantage',
    visual: (
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-sm font-bold">
          <thead><tr>
            {['Algorithm','Key Size','Security'].map(h => <th key={h} className="border-2 border-black p-2 bg-black text-yellow-300 text-xs">{h}</th>)}
          </tr></thead>
          <tbody>
            {[['DH','2048 bits','112 bits','bg-red-100'],['ECDH P-256','256 bits','128 bits','bg-green-100'],['ECDH P-384','384 bits','192 bits','bg-green-100']].map(([a,k,s,c]) => (
              <tr key={a} className={c}>{[a,k,s].map((v,i) => <td key={i} className="border-2 border-black p-2 text-xs text-center">{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    explanation: "ECDH achieves the same security as DH with ~8× smaller keys. P-256 with 256 bits matches 3072-bit classical DH for security.",
  },
];

interface Props { activeTab: 'learn' | 'play' }

async function ecdhDemo() {
  const [aliceKP, bobKP] = await Promise.all([
    window.crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']),
    window.crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']),
  ]) as [CryptoKeyPair, CryptoKeyPair];

  const [aliceShared, bobShared] = await Promise.all([
    window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: bobKP.publicKey },
      aliceKP.privateKey,
      { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
    ),
    window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: aliceKP.publicKey },
      bobKP.privateKey,
      { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
    ),
  ]);

  const [aliceExport, bobExport] = await Promise.all([
    window.crypto.subtle.exportKey('raw', aliceShared),
    window.crypto.subtle.exportKey('raw', bobShared),
  ]);

  const toHex = (buf: ArrayBuffer) =>
    Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

  const alicePubExport = await window.crypto.subtle.exportKey('raw', aliceKP.publicKey);
  const bobPubExport = await window.crypto.subtle.exportKey('raw', bobKP.publicKey);

  return {
    alicePub: toHex(alicePubExport).slice(0, 64) + '…',
    bobPub: toHex(bobPubExport).slice(0, 64) + '…',
    aliceSecret: toHex(aliceExport),
    bobSecret: toHex(bobExport),
    match: toHex(aliceExport) === toHex(bobExport),
  };
}

export function ECDHLearn() {
  return (
    <div className="space-y-6">
      <StepPlayer steps={ECDH_STEPS} accentColor="bg-indigo-300" />
      <div className="bg-indigo-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">Elliptic Curve Diffie-Hellman</h3>
        <p className="font-bold text-sm leading-relaxed">
          <strong>ECDH</strong> is the elliptic-curve variant of Diffie-Hellman. Instead of modular exponentiation with
          large primes, it uses <strong>point multiplication on an elliptic curve</strong>. The Elliptic Curve Discrete
          Logarithm Problem (ECDLP) is harder than classical DLP — allowing the same security with much smaller keys.
        </p>
      </div>

      {/* Curve visualization */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Elliptic Curve y² = x³ + ax + b</h3>
        <svg viewBox="-4 -3 8 6" className="w-full max-w-xs mx-auto border-2 border-black rounded-xl bg-gray-50" style={{ height: 200 }}>
          {/* Axes */}
          <line x1="-3.8" y1="0" x2="3.8" y2="0" stroke="black" strokeWidth="0.05" />
          <line x1="0" y1="-2.8" x2="0" y2="2.8" stroke="black" strokeWidth="0.05" />
          {/* Curve (y² = x³ - x + 1 approx) */}
          <path
            d="M -1.3 -0.5 C -0.8 -1.8 0 -2.2 0.8 -2.0 C 1.4 -1.8 2.2 -1.0 2.8 0.3"
            stroke="#6366f1" strokeWidth="0.08" fill="none" />
          <path
            d="M -1.3 0.5 C -0.8 1.8 0 2.2 0.8 2.0 C 1.4 1.8 2.2 1.0 2.8 -0.3"
            stroke="#6366f1" strokeWidth="0.08" fill="none" />
          {/* Points */}
          <circle cx="0.5" cy="-1.9" r="0.12" fill="#0ea5e9" />
          <circle cx="1.8" cy="-1.3" r="0.12" fill="#ec4899" />
          <circle cx="2.5" cy="0.2" r="0.12" fill="#22c55e" />
          <text x="0.6" y="-2.0" fontSize="0.25" fontWeight="bold" fill="#0ea5e9">G</text>
          <text x="1.9" y="-1.4" fontSize="0.25" fontWeight="bold" fill="#ec4899">aG</text>
          <text x="2.6" y="0.1" fontSize="0.25" fontWeight="bold" fill="#22c55e">abG</text>
        </svg>
        <p className="text-xs font-bold text-center mt-2 text-black/60">
          G = generator point. Alice computes aG, Bob computes bG, shared secret = abG.
        </p>
      </div>

      {/* DH vs ECDH */}
      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">DH vs ECDH — Key Size Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm font-bold">
            <thead>
              <tr>
                {['Security (bits)', 'RSA/DH key size', 'ECDH key size', 'Speedup'].map(h => (
                  <th key={h} className="border-2 border-black p-2 bg-black text-yellow-300 text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['80', '1024 bits', '160 bits', '~6x'],
                ['112', '2048 bits', '224 bits', '~9x'],
                ['128', '3072 bits', '256 bits', '~12x'],
                ['256', '15360 bits', '512 bits', '~30x'],
              ].map(row => (
                <tr key={row[0]} className="even:bg-black/5">
                  {row.map((cell, i) => (
                    <td key={i} className="border-2 border-black p-2 text-center text-xs">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Named Curves */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: 'P-256 (secp256r1)', use: 'TLS, HTTPS, Web Crypto', note: 'NIST curve; most widely deployed. 128-bit security.' },
          { name: 'P-384 (secp384r1)', use: 'NSA Suite B, gov apps', note: '192-bit security. Used where higher assurance is needed.' },
          { name: 'Curve25519', use: 'Signal, WireGuard, SSH', note: 'Bernstein\'s curve; faster, safer design. Ed25519 variant for signatures.' },
        ].map(c => (
          <div key={c.name} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <div className="font-black text-sm">{c.name}</div>
            <div className="text-xs font-bold text-black/60 mb-1">{c.use}</div>
            <p className="text-xs font-bold">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ECDHPlay() {
  const [result, setResult] = useState<Awaited<ReturnType<typeof ecdhDemo>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      setResult(await ecdhDemo());
    } catch {
      setError('ECDH demo failed.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-indigo-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        <strong>Real P-256 ECDH</strong> via Web Crypto API. Generates Alice's and Bob's key pairs in the browser,
        then derives the shared secret from both sides independently.
      </div>

      <button onClick={run} disabled={loading}
        className="w-full py-4 bg-indigo-400 border-4 border-black text-black font-black uppercase text-sm disabled:opacity-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        {loading ? 'Running ECDH…' : 'Run P-256 ECDH Key Exchange'}
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cyan-100 border-4 border-black p-4 rounded-xl">
              <div className="font-black uppercase text-sm mb-2">Alice's Public Key (hex, truncated)</div>
              <div className="font-mono text-xs break-all">{result.alicePub}</div>
            </div>
            <div className="bg-pink-100 border-4 border-black p-4 rounded-xl">
              <div className="font-black uppercase text-sm mb-2">Bob's Public Key (hex, truncated)</div>
              <div className="font-mono text-xs break-all">{result.bobPub}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cyan-200 border-4 border-black p-4 rounded-xl">
              <div className="font-black uppercase text-sm mb-2">Alice's Derived Secret (256-bit)</div>
              <div className="font-mono text-xs break-all">{result.aliceSecret}</div>
            </div>
            <div className="bg-pink-200 border-4 border-black p-4 rounded-xl">
              <div className="font-black uppercase text-sm mb-2">Bob's Derived Secret (256-bit)</div>
              <div className="font-mono text-xs break-all">{result.bobSecret}</div>
            </div>
          </div>

          <div className={`border-4 border-black p-4 rounded-xl font-black text-center text-lg ${result.match ? 'bg-green-300' : 'bg-red-300'}`}>
            {result.match
              ? '✓ Shared secrets match! Alice and Bob can now use this as an AES key.'
              : '✗ Mismatch — something went wrong.'}
          </div>
        </div>
      )}

      {error && <div className="bg-red-300 border-4 border-black p-4 font-bold rounded-xl">{error}</div>}

      <div className="bg-yellow-200 border-4 border-black p-4 rounded-xl font-bold text-sm">
        In real usage (e.g. TLS 1.3), Alice and Bob exchange only their public keys over the network.
        An eavesdropper who intercepts both public keys <em>cannot</em> reconstruct the shared secret
        without solving the Elliptic Curve Discrete Logarithm Problem.
      </div>
    </div>
  );
}

export default function ECDHPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <ECDHLearn /> : <ECDHPlay />}
    </motion.div>
  );
}
