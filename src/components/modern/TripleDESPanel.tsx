import { motion } from 'framer-motion';
import StepPlayer, { CipherStep } from './StepPlayer';

const TDES_STEPS: CipherStep[] = [
  {
    title: 'Plaintext In',
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="bg-yellow-200 border-4 border-black font-black text-sm text-center px-6 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">64-bit Plaintext</div>
        <div className="font-black text-xl">↓</div>
        <div className="text-xs font-bold text-black/50">Enters EDE chain →</div>
      </div>
    ),
    explanation: "3DES accepts the same 64-bit block as DES. It runs the block through three DES operations to multiply security.",
  },
  {
    title: 'EDE: Encrypt with K1',
    visual: (
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <div className="bg-yellow-200 border-4 border-black px-3 py-3 rounded-xl font-black text-xs text-center min-w-[70px]">Plaintext</div>
        <div className="font-black text-xl">→</div>
        <div className="bg-cyan-400 border-4 border-black px-3 py-4 rounded-xl font-black text-xs text-center min-w-[70px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-4 ring-black">
          DES ENC<br/>K1
        </div>
        <div className="font-black text-xl text-black/30">→</div>
        <div className="bg-gray-100 border-2 border-dashed border-black px-3 py-4 rounded-xl font-bold text-xs text-center min-w-[70px] text-black/40">
          DES DEC<br/>K2
        </div>
        <div className="font-black text-xl text-black/20">→</div>
        <div className="bg-gray-100 border-2 border-dashed border-black px-3 py-4 rounded-xl font-bold text-xs text-center min-w-[70px] text-black/40">
          DES ENC<br/>K3
        </div>
      </div>
    ),
    explanation: "Step 1: Encrypt with K1 using standard DES. This first pass randomizes the plaintext.",
  },
  {
    title: 'EDE: Decrypt with K2',
    visual: (
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <div className="bg-gray-100 border-2 border-dashed border-black px-3 py-4 rounded-xl font-bold text-xs text-center min-w-[70px] text-black/40">DES ENC K1</div>
        <div className="font-black text-xl">→</div>
        <div className="bg-pink-400 border-4 border-black px-3 py-4 rounded-xl font-black text-xs text-center min-w-[70px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-4 ring-black">
          DES DEC<br/>K2
        </div>
        <div className="font-black text-xl text-black/30">→</div>
        <div className="bg-gray-100 border-2 border-dashed border-black px-3 py-4 rounded-xl font-bold text-xs text-center min-w-[70px] text-black/40">DES ENC K3</div>
      </div>
    ),
    explanation: "Step 2: DECRYPT (not encrypt!) with K2. This unusual step allows K1=K2=K3 to degenerate back to plain DES for backward compatibility.",
  },
  {
    title: 'EDE: Encrypt with K3',
    visual: (
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <div className="bg-gray-100 border-2 border-dashed border-black px-3 py-4 rounded-xl font-bold text-xs text-center min-w-[70px] text-black/40">DES ENC K1</div>
        <div className="font-black text-xl text-black/30">→</div>
        <div className="bg-gray-100 border-2 border-dashed border-black px-3 py-4 rounded-xl font-bold text-xs text-center min-w-[70px] text-black/40">DES DEC K2</div>
        <div className="font-black text-xl">→</div>
        <div className="bg-green-400 border-4 border-black px-3 py-4 rounded-xl font-black text-xs text-center min-w-[70px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-4 ring-black">
          DES ENC<br/>K3
        </div>
        <div className="font-black text-xl">→</div>
        <div className="bg-purple-200 border-4 border-black px-3 py-3 rounded-xl font-black text-xs text-center min-w-[70px]">Ciphertext</div>
      </div>
    ),
    explanation: "Step 3: Encrypt again with K3. The full EDE chain (Encrypt-Decrypt-Encrypt) produces ~112 bits of effective security with 3 independent keys.",
  },
];

interface Props { activeTab: 'learn' | 'play' }

export function TripleDESLearn() {
  return (
    <div className="space-y-6">
      <StepPlayer steps={TDES_STEPS} accentColor="bg-pink-300" />
      <div className="bg-pink-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">What is 3DES?</h3>
        <p className="font-bold text-sm leading-relaxed">
          <strong>Triple DES (3DES / TDEA)</strong> applies DES three times to each block: Encrypt → Decrypt → Encrypt.
          This EDE structure allows backwards compatibility — when K1 = K2 = K3, it degenerates into plain DES.
          Published as ANSI X9.52 and FIPS 46-3, it was the transition cipher between DES and AES (1999–2023).
        </p>
      </div>

      {/* EDE Structure */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-4">Encrypt-Decrypt-Encrypt (EDE)</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-sm">
          <div className="bg-yellow-200 border-4 border-black p-3 rounded-xl text-center font-black text-xs min-w-[80px]">
            Plaintext
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-cyan-300 border-4 border-black p-3 rounded-xl text-center font-black text-xs">
            DES<br/>Encrypt<br/>K1
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-pink-300 border-4 border-black p-3 rounded-xl text-center font-black text-xs">
            DES<br/>Decrypt<br/>K2
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-green-300 border-4 border-black p-3 rounded-xl text-center font-black text-xs">
            DES<br/>Encrypt<br/>K3
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-purple-200 border-4 border-black p-3 rounded-xl text-center font-black text-xs min-w-[80px]">
            Ciphertext
          </div>
        </div>
        <p className="text-xs font-bold text-black/60 mt-3 text-center">
          Note: The middle step is Decrypt, not Encrypt. This allows K1=K2=K3 to produce plain DES.
        </p>
      </div>

      {/* Key Options */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: '3TDEA', bits: '168-bit', desc: 'K1 ≠ K2 ≠ K3 — three independent 56-bit keys. Strongest option. Effective ~112-bit security (meet-in-middle).', color: 'bg-green-200' },
          { name: '2TDEA', bits: '112-bit', desc: 'K1 ≠ K2, K3 = K1 — only two distinct keys. Effective ~80-bit security. Used in financial sector (EMV cards).', color: 'bg-yellow-200' },
          { name: 'Degenerate', bits: '56-bit', desc: 'K1 = K2 = K3 — same as plain DES. Provides backward compat. No security benefit.', color: 'bg-red-200' },
        ].map(k => (
          <div key={k.name} className={`${k.color} border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl`}>
            <div className="font-black uppercase text-lg">{k.name}</div>
            <div className="font-black text-sm mb-2">{k.bits}</div>
            <p className="text-xs font-bold">{k.desc}</p>
          </div>
        ))}
      </div>

      {/* SWEET32 Attack */}
      <div className="bg-red-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">SWEET32 Birthday Attack (2016)</h3>
        <p className="font-bold text-sm mb-3">
          3DES uses a 64-bit block size. After ~2³² blocks (≈ 32 GB), birthday-bound collisions become probable.
          Attackers can recover plaintext segments from TLS sessions using collision data.
        </p>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ NIST deprecated 3DES in 2019 (disallowed for new applications)</li>
          <li>→ NIST officially withdrew 3DES in 2023 (FIPS 46-3 withdrawn)</li>
          <li>→ Migration target: AES-128-GCM or AES-256-GCM</li>
        </ul>
      </div>

      {/* Comparison */}
      <div className="bg-cyan-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">3DES vs AES</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm font-bold">
            <thead>
              <tr>
                {['Property', '3DES', 'AES-256'].map(h => (
                  <th key={h} className="border-2 border-black p-2 bg-black text-yellow-300 text-xs text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Key size', '112 / 168 bits', '256 bits'],
                ['Block size', '64 bits ⚠', '128 bits'],
                ['Speed', '~3× slower than DES', '10–40× faster than 3DES (AES-NI)'],
                ['Status', 'Withdrawn 2023', 'Current standard'],
                ['Quantum safety', 'No', 'Effectively yes (AES-256)'],
              ].map(([prop, des, aes]) => (
                <tr key={prop} className="even:bg-black/5">
                  <td className="border-2 border-black p-2 font-black text-xs">{prop}</td>
                  <td className="border-2 border-black p-2 text-xs">{des}</td>
                  <td className="border-2 border-black p-2 text-xs">{aes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function TripleDESPlay() {
  return (
    <div className="space-y-5">
      <div className="bg-pink-100 border-4 border-black p-5 rounded-xl">
        <h3 className="font-black uppercase text-lg mb-2">3DES is Withdrawn</h3>
        <p className="font-bold text-sm leading-relaxed">
          NIST officially withdrew 3DES / TDEA as a standard in 2023. It is not available in the Web Crypto API
          and should not be used in any new application. Use AES-256-GCM instead.
        </p>
      </div>

      <div className="bg-green-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Migration Guide</h3>
        <div className="space-y-3 text-sm font-bold">
          <p>If you have legacy 3DES-encrypted data and need to migrate:</p>
          <div className="bg-black text-green-300 p-3 rounded-xl font-mono text-xs">
            <div className="text-yellow-300 font-bold mb-2"># Step 1: Decrypt old data with 3DES (legacy system)</div>
            <div>plaintext = 3des_decrypt(ciphertext, old_key)</div>
            <br />
            <div className="text-yellow-300 font-bold mb-2"># Step 2: Re-encrypt with AES-256-GCM</div>
            <div>new_key = generate_aes_256_key()</div>
            <div>new_ciphertext = aes_gcm_encrypt(plaintext, new_key)</div>
          </div>
          <p>→ Use the <strong>AES</strong> panel in this section to encrypt with real AES-256-GCM.</p>
        </div>
      </div>
    </div>
  );
}

export default function TripleDESPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <TripleDESLearn /> : <TripleDESPlay />}
    </motion.div>
  );
}
