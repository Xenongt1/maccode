import { motion } from 'framer-motion';

interface Props { activeTab: 'learn' | 'play' }

export function DESLearn() {
  return (
    <div className="space-y-6">
      <div className="bg-orange-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">What is DES?</h3>
        <p className="font-bold text-sm leading-relaxed">
          The <strong>Data Encryption Standard</strong> (DES) was the first publicly adopted symmetric cipher standard,
          published by NIST in 1977. It uses a <strong>56-bit key</strong> and a <strong>Feistel network</strong> with
          16 rounds to encrypt 64-bit blocks. Though broken (EFF DES Cracker, 1998), it shaped all of modern cryptography.
        </p>
      </div>

      {/* Feistel Structure */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-4">Feistel Network Structure</h3>
        <div className="flex flex-col items-center gap-2 font-mono text-sm">
          <div className="w-full max-w-sm bg-yellow-200 border-4 border-black p-3 rounded-xl text-center font-black">
            64-bit Plaintext Block
          </div>
          <div className="text-2xl">↓</div>
          <div className="flex gap-4 w-full max-w-sm">
            <div className="flex-1 bg-cyan-200 border-4 border-black p-2 rounded-xl text-center font-black text-xs">L₀ (32 bits)</div>
            <div className="flex-1 bg-pink-200 border-4 border-black p-2 rounded-xl text-center font-black text-xs">R₀ (32 bits)</div>
          </div>
          <div className="text-sm font-bold text-black/60">× 16 rounds ↓</div>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 w-full max-w-sm items-center">
              <div className="flex-1 bg-cyan-100 border-2 border-black p-2 rounded-xl text-center font-bold text-xs">
                L{i} = R{i-1}
              </div>
              <div className="flex-1 bg-pink-100 border-2 border-black p-2 rounded-xl text-center font-bold text-xs">
                R{i} = L{i-1} ⊕ f(R{i-1}, K{i})
              </div>
            </div>
          ))}
          <div className="text-sm font-bold">⋮</div>
          <div className="w-full max-w-sm bg-green-300 border-4 border-black p-3 rounded-xl text-center font-black">
            64-bit Ciphertext Block
          </div>
        </div>
      </div>

      {/* The f-function */}
      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-4">The f-Function (Round Function)</h3>
        <div className="space-y-3">
          {[
            { step: '1. Expansion', desc: '32-bit R → 48 bits via E-permutation (some bits duplicated)', color: 'bg-cyan-100' },
            { step: '2. Key Mixing', desc: 'XOR with 48-bit round key Kᵢ', color: 'bg-yellow-100' },
            { step: '3. S-Boxes', desc: '8 × S-box: each takes 6 bits → 4 bits (nonlinear substitution)', color: 'bg-pink-100' },
            { step: '4. P-Permutation', desc: '32-bit result is permuted to spread bit influence', color: 'bg-green-100' },
          ].map(s => (
            <div key={s.step} className={`${s.color} border-2 border-black p-3 rounded-xl flex gap-3`}>
              <span className="font-black text-sm shrink-0">{s.step}</span>
              <span className="font-bold text-sm">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Schedule */}
      <div className="bg-purple-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Key Schedule</h3>
        <p className="font-bold text-sm mb-3">
          The 64-bit input key (8 bits are parity, leaving 56 effective bits) is split into two 28-bit halves C and D.
          Each round, both halves are cyclically left-shifted by 1 or 2 positions, then PC-2 selects 48 bits for Kᵢ.
        </p>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className="bg-white border-2 border-black p-2 rounded-lg text-center">
              <div className="font-black text-xs">K{i + 1}</div>
              <div className="text-xs font-bold text-black/60">48 bits</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why DES Failed */}
      <div className="bg-red-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Why DES Was Broken</h3>
        <ul className="space-y-2 text-sm font-bold">
          <li>→ Only 2⁵⁶ ≈ 72 quadrillion key combinations — brute-forceable</li>
          <li>→ 1998: EFF's "Deep Crack" machine broke DES in 22 hours for $250k</li>
          <li>→ 1999: DES cracked in under 24 hours using distributed computing</li>
          <li>→ Lesson: key length matters — never use fewer than 128 bits today</li>
        </ul>
      </div>
    </div>
  );
}

export function DESPlay() {
  return (
    <div className="space-y-5">
      <div className="bg-orange-100 border-4 border-black p-5 rounded-xl">
        <h3 className="font-black uppercase text-lg mb-2">DES is Legacy-Only</h3>
        <p className="font-bold text-sm leading-relaxed">
          DES is not available in the Web Crypto API because it is officially deprecated and insecure.
          Its 56-bit key can be brute-forced in hours with consumer hardware.
        </p>
      </div>

      <div className="bg-green-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">What to Use Instead</h3>
        <div className="space-y-3">
          {[
            { name: 'AES-256-GCM', where: 'Modern Crypto → AES', desc: 'Gold standard — authenticated encryption, quantum-resistant at 256-bit' },
            { name: 'ChaCha20-Poly1305', where: 'TLS 1.3, mobile', desc: 'Stream cipher alternative; faster on devices without AES hardware' },
            { name: 'AES-128-GCM', where: 'Modern Crypto → AES', desc: 'Still very secure; smaller key, faster than AES-256' },
          ].map(r => (
            <div key={r.name} className="bg-white border-2 border-black p-3 rounded-xl">
              <div className="font-black text-sm">{r.name}</div>
              <div className="text-xs font-bold text-black/60">{r.where}</div>
              <div className="text-sm font-bold mt-1">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">DES Timeline</h3>
        {[
          ['1972', 'NBS (now NIST) solicits a standard cipher'],
          ['1977', 'DES published as FIPS 46'],
          ['1993', 'DES reaffirmed (critics already worried)'],
          ['1998', 'EFF Deep Crack breaks DES in 22 hours'],
          ['1999', 'Broken in < 24 hours combined with distributed.net'],
          ['2005', 'DES officially withdrawn as a standard'],
          ['2001', 'AES adopted as the replacement (FIPS 197)'],
        ].map(([year, event]) => (
          <div key={year} className="flex gap-3 mb-2">
            <span className="font-black text-sm w-12 shrink-0">{year}</span>
            <span className="font-bold text-sm">{event}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DESPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <DESLearn /> : <DESPlay />}
    </motion.div>
  );
}
