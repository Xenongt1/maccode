import { useState } from 'react';
import { motion } from 'framer-motion';
import StepPlayer, { CipherStep } from './StepPlayer';

function RotorRing({ letter, color, highlight = false }: { letter: string; color: string; highlight?: boolean }) {
  return (
    <div className={`${color} border-4 border-black w-14 h-14 flex items-center justify-center font-black text-2xl rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${highlight ? 'ring-4 ring-yellow-400' : ''}`}>
      {letter}
    </div>
  );
}

const ENIGMA_STEPS: CipherStep[] = [
  {
    title: 'Starting Position',
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs font-black uppercase text-black/50 mb-1">Rotors: I II III — all at A</div>
        <div className="flex gap-4 items-center">
          <div className="text-center"><RotorRing letter="A" color="bg-cyan-200" /><div className="text-xs font-black mt-1">Left</div></div>
          <div className="text-center"><RotorRing letter="A" color="bg-pink-200" /><div className="text-xs font-black mt-1">Middle</div></div>
          <div className="text-center"><RotorRing letter="A" color="bg-yellow-200" highlight /><div className="text-xs font-black mt-1">Right ↑</div></div>
        </div>
        <div className="bg-black text-yellow-300 px-3 py-1.5 rounded-xl font-black text-xs">Press key 'A' →</div>
      </div>
    ),
    explanation: "Before any key is pressed, all three rotors sit at position A. The rightmost rotor steps every single keypress.",
  },
  {
    title: 'Rotor Steps',
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs font-bold text-black/50">After pressing 'A'</div>
        <div className="flex gap-4 items-center">
          <div className="text-center"><RotorRing letter="A" color="bg-cyan-200" /><div className="text-xs font-black mt-1">Left</div></div>
          <div className="text-center"><RotorRing letter="A" color="bg-pink-200" /><div className="text-xs font-black mt-1">Middle</div></div>
          <div className="text-center"><RotorRing letter="B" color="bg-yellow-300" highlight /><div className="text-xs font-black mt-1">Right ↑+1</div></div>
        </div>
        <div className="bg-green-200 border-2 border-black px-3 py-1.5 rounded-xl font-bold text-xs">A → B: right rotor stepped</div>
      </div>
    ),
    explanation: "The rightmost rotor advances by 1 position with every keypress. After 26 presses, it carries over to the middle rotor — like an odometer.",
  },
  {
    title: 'Signal Path',
    visual: (
      <div className="flex flex-col gap-1 text-xs font-black">
        <div className="flex flex-wrap gap-1 justify-center">
          {['Key A','Plugboard','→ Rotor R','→ Rotor M','→ Rotor L','↔ Reflect','← Rotor L','← Rotor M','← Rotor R','Plugboard','Lamp'].map((s, i) => (
            <div key={i} className={`border-2 border-black px-1.5 py-1 rounded text-center text-xs
              ${i===0?'bg-yellow-300':i===5?'bg-purple-300':i===10?'bg-green-300':'bg-white'}`}>
              {s}
            </div>
          ))}
        </div>
        <div className="text-center text-black/50 text-xs mt-1">Current path through 11 stages</div>
      </div>
    ),
    explanation: "The electrical signal travels right-to-left through the rotors, bounces off the reflector, and returns left-to-right. It never encodes a letter as itself.",
  },
  {
    title: 'Polyalphabetic',
    visual: (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-xs font-bold">
          <thead><tr>
            {['Keypress','Rotor R','Rotor M','Output'].map(h => <th key={h} className="border-2 border-black p-1 bg-black text-yellow-300">{h}</th>)}
          </tr></thead>
          <tbody>
            {[['1','B','A','G'],['2','C','A','T'],['3','D','A','Z'],['4','E','A','Q']].map(([n,r,m,o]) => (
              <tr key={n} className="even:bg-yellow-50">
                <td className="border-2 border-black p-1 text-center">{n}</td>
                <td className="border-2 border-black p-1 text-center">{r}</td>
                <td className="border-2 border-black p-1 text-center">{m}</td>
                <td className="border-2 border-black p-1 text-center bg-yellow-200 font-black">{o}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center text-xs font-bold mt-1 text-black/60">Same key 'A' → different letter each time</div>
      </div>
    ),
    explanation: "Because rotors step before each keypress, pressing 'A' four times produces four different ciphertext letters. This defeats frequency analysis.",
  },
  {
    title: 'Double-Stepping',
    visual: (
      <div className="space-y-2 w-full max-w-xs mx-auto">
        <div className="text-xs font-black uppercase text-center mb-1">Notch anomaly at position V</div>
        {[['Normal','V','E','A'],['Anomaly','W','F','B']].map(([label, r, m, l]) => (
          <div key={label} className={`flex gap-2 items-center p-2 rounded-xl border-4 border-black ${label==='Anomaly'?'bg-red-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]':'bg-white'}`}>
            <span className="text-xs font-black w-16">{label}</span>
            {[r,m,l].map((v, i) => (
              <div key={i} className={`border-2 border-black rounded-full w-10 h-10 flex items-center justify-center font-black text-sm
                ${label==='Anomaly'&&i===1?'bg-red-400':i===0?'bg-yellow-200':i===1?'bg-pink-200':'bg-cyan-200'}`}>{v}</div>
            ))}
            <span className="text-xs font-bold text-black/50">{['R','M','L'].join(' ')}</span>
          </div>
        ))}
      </div>
    ),
    explanation: "The double-stepping anomaly: when the middle rotor's notch aligns, it steps AGAIN even though it stepped the previous keypress too — a famous Enigma quirk exploited by codebreakers.",
  },
];

interface Props { activeTab: 'learn' | 'play' }

// Historical Enigma Rotors (I-V) with notch positions
const ROTORS: Record<string, { wiring: string; notch: string }> = {
  'I':   { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  'II':  { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  'III': { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  'IV':  { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  'V':   { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
};
const REFLECTORS: Record<string, string> = {
  'UKW-B': 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  'UKW-C': 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
};
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function applyPlugboard(c: string, plugboard: Record<string, string>): string {
  return plugboard[c] || c;
}
function rotorForward(c: string, wiring: string, offset: number): string {
  const idx = (ALPHA.indexOf(c) + offset + 26) % 26;
  const out = wiring[idx];
  return ALPHA[(ALPHA.indexOf(out) - offset + 26) % 26];
}
function rotorBackward(c: string, wiring: string, offset: number): string {
  const shifted = ALPHA[(ALPHA.indexOf(c) + offset + 26) % 26];
  const idx = wiring.indexOf(shifted);
  return ALPHA[(idx - offset + 26) % 26];
}

function enigmaEncrypt(
  text: string,
  rotorNames: [string, string, string],
  positions: [number, number, number],
  reflectorName: string,
  plugboard: Record<string, string>
): string {
  const offsets = [...positions] as [number, number, number];
  const [rL, rM, rR] = rotorNames.map(n => ROTORS[n]);
  const reflector = REFLECTORS[reflectorName];
  let result = '';

  for (const char of text.toUpperCase()) {
    if (!ALPHA.includes(char)) { result += char; continue; }

    // Double-stepping anomaly
    const midAtNotch = ALPHA[offsets[1]] === rM.notch;
    const rightAtNotch = ALPHA[offsets[2]] === rR.notch;
    if (midAtNotch) { offsets[0] = (offsets[0] + 1) % 26; offsets[1] = (offsets[1] + 1) % 26; }
    if (rightAtNotch) offsets[1] = (offsets[1] + 1) % 26;
    offsets[2] = (offsets[2] + 1) % 26;

    let c = applyPlugboard(char, plugboard);
    c = rotorForward(c, rR.wiring, offsets[2]);
    c = rotorForward(c, rM.wiring, offsets[1]);
    c = rotorForward(c, rL.wiring, offsets[0]);
    c = ALPHA[REFLECTORS[reflectorName].indexOf(c) < 0 ? ALPHA.indexOf(c) : reflector.indexOf(c)];
    // Reflector: map via UKW
    const rfIdx = ALPHA.indexOf(c);
    c = reflector[rfIdx] || c;
    c = rotorBackward(c, rL.wiring, offsets[0]);
    c = rotorBackward(c, rM.wiring, offsets[1]);
    c = rotorBackward(c, rR.wiring, offsets[2]);
    c = applyPlugboard(c, plugboard);
    result += c;
  }
  return result;
}

export function EnigmaLearn() {
  return (
    <div className="space-y-6">
      <StepPlayer steps={ENIGMA_STEPS} accentColor="bg-stone-300" />
      <div className="bg-stone-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="text-xl font-black uppercase mb-2">The Enigma Machine</h3>
        <p className="font-bold text-sm leading-relaxed">
          Used by Nazi Germany in WWII, the <strong>Enigma</strong> is a rotor-based electromechanical cipher machine.
          Its breaking by Alan Turing and colleagues at Bletchley Park (via the Bombe machine) is considered one of the
          most significant events of the 20th century, shortening the war by an estimated 2-4 years.
        </p>
      </div>

      {/* Components */}
      <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-4">Machine Components</h3>
        <div className="space-y-3">
          {[
            { name: 'Plugboard (Steckerbrett)', desc: 'Pairs up to 10 letter pairs (A↔Z, B↔Y…), adding a first layer of substitution before and after the rotors. Dramatically expands the key space.', color: 'bg-yellow-100' },
            { name: 'Rotors (Walzen)', desc: '3 rotors (from 5 available: I-V) each provide a substitution wiring. Critically, each rotor STEPS as keys are pressed — making Enigma polyalphabetic.', color: 'bg-cyan-100' },
            { name: 'Notch Mechanism', desc: 'Each rotor has a notch that triggers stepping of the next rotor. The double-stepping anomaly causes the middle rotor to step twice in a row sometimes.', color: 'bg-pink-100' },
            { name: 'Reflector (Umkehrwalze)', desc: 'A fixed wiring that reflects signals back through the rotors in reverse. Makes encryption = decryption (same settings decrypt). A fatal design flaw: no letter could encrypt to itself.', color: 'bg-green-100' },
          ].map(c => (
            <div key={c.name} className={`${c.color} border-2 border-black p-3 rounded-xl`}>
              <div className="font-black text-sm mb-1">{c.name}</div>
              <p className="text-xs font-bold">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Signal Path */}
      <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Signal Path (Pressing Key 'A')</h3>
        <div className="flex flex-wrap items-center gap-2 font-mono text-sm font-bold">
          {[
            { label: 'Keyboard', color: 'bg-gray-200' },
            { label: '→', color: '' },
            { label: 'Plugboard', color: 'bg-yellow-300' },
            { label: '→', color: '' },
            { label: 'Rotor R→', color: 'bg-cyan-300' },
            { label: '→', color: '' },
            { label: 'Rotor M→', color: 'bg-cyan-300' },
            { label: '→', color: '' },
            { label: 'Rotor L→', color: 'bg-cyan-300' },
            { label: '→', color: '' },
            { label: 'Reflector', color: 'bg-purple-300' },
            { label: '→', color: '' },
            { label: '←Rotor L', color: 'bg-pink-300' },
            { label: '→', color: '' },
            { label: '←Rotor M', color: 'bg-pink-300' },
            { label: '→', color: '' },
            { label: '←Rotor R', color: 'bg-pink-300' },
            { label: '→', color: '' },
            { label: 'Plugboard', color: 'bg-yellow-300' },
            { label: '→', color: '' },
            { label: 'Lamp lights', color: 'bg-green-300' },
          ].map((s, i) => s.color
            ? <div key={i} className={`${s.color} border-2 border-black px-2 py-1 rounded-lg text-xs`}>{s.label}</div>
            : <span key={i} className="text-lg">{s.label}</span>
          )}
        </div>
      </div>

      {/* Why it was broken */}
      <div className="bg-red-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Fatal Cryptographic Flaws</h3>
        <ul className="space-y-1 text-sm font-bold">
          <li>→ No letter could ever encrypt to itself (reflector constraint) — Turing exploited this</li>
          <li>→ Operators reused day keys, used predictable cribs (WETTER VORHERSAGE = weather report)</li>
          <li>→ Message indicators were often sent twice (Sicherung) — crib dragging worked</li>
          <li>→ Operators typed their girlfriend's names as keys: "AAA", "AAB", "CCC" were common</li>
          <li>→ Stereotyped messages: "Nothing to report" → "Keine besonderen Ereignisse" (known plaintext)</li>
        </ul>
      </div>

      {/* Key space */}
      <div className="bg-cyan-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
        <h3 className="font-black uppercase mb-3">Theoretical Key Space</h3>
        <div className="font-mono text-sm space-y-1">
          <div>Rotor choice (3 from 5): 60</div>
          <div>Rotor positions (26³): 17,576</div>
          <div>Plugboard (10 pairs from 26): ~150 trillion</div>
          <div className="font-black text-base mt-2">Total ≈ 10¹⁶ combinations (10 quadrillion)</div>
        </div>
        <p className="text-sm font-bold mt-2 text-black/70">
          Yet Turing's Bombe could crack it in minutes by exploiting structural flaws, not brute force.
        </p>
      </div>
    </div>
  );
}

export function EnigmaPlay() {
  const rotorChoices = Object.keys(ROTORS);
  const [rotors, setRotors] = useState<[string, string, string]>(['I', 'II', 'III']);
  const [positions, setPositions] = useState<[number, number, number]>([0, 0, 0]);
  const [reflector, setReflector] = useState<'UKW-B' | 'UKW-C'>('UKW-B');
  const [plugboardStr, setPlugboardStr] = useState('AZ BY CX');
  const [input, setInput] = useState('HELLO WORLD');
  const [output, setOutput] = useState('');

  const parsePlugboard = (s: string): Record<string, string> => {
    const pb: Record<string, string> = {};
    s.toUpperCase().split(/\s+/).forEach(pair => {
      const [a, b] = pair.split('');
      if (a && b && a !== b) { pb[a] = b; pb[b] = a; }
    });
    return pb;
  };

  const encrypt = () => {
    const pb = parsePlugboard(plugboardStr);
    const result = enigmaEncrypt(input, rotors, [...positions] as [number, number, number], reflector, pb);
    setOutput(result);
  };

  return (
    <div className="space-y-5">
      <div className="bg-stone-100 border-4 border-black p-4 rounded-xl font-bold text-sm">
        Authentic Enigma simulation with double-stepping. Encryption = decryption — encrypt a message,
        set same settings on the right, paste ciphertext to get back the plaintext.
      </div>

      {/* Rotors */}
      <div>
        <label className="block font-black uppercase text-sm mb-2">Rotors (Left → Middle → Right)</label>
        <div className="grid grid-cols-3 gap-3">
          {([0, 1, 2] as const).map(i => (
            <div key={i}>
              <select value={rotors[i]} onChange={e => {
                const r = [...rotors] as [string, string, string];
                r[i] = e.target.value;
                setRotors(r);
              }} className="w-full px-3 py-2 border-4 border-black bg-yellow-100 font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-400">
                {rotorChoices.map(r => <option key={r}>{r}</option>)}
              </select>
              <select value={ALPHA[positions[i]]} onChange={e => {
                const p = [...positions] as [number, number, number];
                p[i] = ALPHA.indexOf(e.target.value);
                setPositions(p);
              }} className="w-full mt-2 px-3 py-2 border-4 border-black bg-cyan-100 font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-400">
                {ALPHA.split('').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          ))}
        </div>
        <p className="text-xs font-bold mt-1 text-black/60">Top row: rotor choice. Bottom row: start position.</p>
      </div>

      {/* Reflector */}
      <div>
        <label className="block font-black uppercase text-sm mb-1">Reflector</label>
        <div className="flex gap-3">
          {(['UKW-B', 'UKW-C'] as const).map(r => (
            <button key={r} onClick={() => setReflector(r)}
              className={`flex-1 py-2 font-black uppercase text-sm border-4 border-black rounded-xl transition-all ${reflector === r ? 'bg-purple-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 translate-y-0.5' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Plugboard */}
      <div>
        <label className="block font-black uppercase text-sm mb-1">Plugboard (space-separated pairs e.g. AZ BY CX)</label>
        <input value={plugboardStr} onChange={e => setPlugboardStr(e.target.value)}
          placeholder="AZ BY CX DW EV"
          className="w-full px-4 py-3 border-4 border-black bg-pink-100 font-bold focus:outline-none focus:ring-4 focus:ring-pink-400 rounded-xl uppercase" />
      </div>

      {/* Input */}
      <div>
        <label className="block font-black uppercase text-sm mb-1">Message</label>
        <textarea rows={3} value={input} onChange={e => setInput(e.target.value.toUpperCase())}
          className="w-full px-4 py-3 border-4 border-black bg-yellow-100 font-bold focus:outline-none focus:ring-4 focus:ring-stone-400 resize-none rounded-xl uppercase" />
      </div>

      <button onClick={encrypt}
        className="w-full py-4 bg-black text-yellow-300 border-4 border-black font-black uppercase text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl">
        Encrypt / Decrypt
      </button>

      {output && (
        <div>
          <label className="block font-black uppercase text-sm mb-1">Output</label>
          <div className="bg-green-100 border-4 border-black p-4 rounded-xl font-mono font-bold break-all">
            {output}
          </div>
          <p className="text-xs font-bold mt-1 text-black/60">
            Same settings + paste ciphertext → recovers plaintext (Enigma is its own inverse).
          </p>
        </div>
      )}
    </div>
  );
}

export default function EnigmaPanel({ activeTab }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {activeTab === 'learn' ? <EnigmaLearn /> : <EnigmaPlay />}
    </motion.div>
  );
}
