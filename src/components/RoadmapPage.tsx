import { motion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, Zap, Lock, Globe, Cpu, Atom, FlaskConical } from 'lucide-react';

interface RoadmapPageProps {
  onNavigate: (section: 'visualizer' | 'modern') => void;
}

interface Topic {
  name: string;
  section: 'visualizer' | 'modern';
}

interface Stage {
  number: number;
  title: string;
  subtitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  levelColor: string;
  bgColor: string;
  accentColor: string;
  icon: React.ReactNode;
  timeEstimate: string;
  description: string;
  topics: Topic[];
  concepts: string[];
  prerequisite: string | null;
}

const STAGES: Stage[] = [
  {
    number: 1,
    title: 'How Cryptography Works',
    subtitle: 'The Big Picture',
    level: 'Beginner',
    levelColor: 'bg-green-400',
    bgColor: 'bg-green-100',
    accentColor: 'bg-green-300',
    icon: <BookOpen size={28} />,
    timeEstimate: '1–2 hours',
    description:
      "Start with the simplest cipher invented. Understand what plaintext, ciphertext, and a key mean. Build intuition for why shifting letters is 'encryption' and why it's trivially breakable.",
    topics: [
      { name: 'Caesar Cipher', section: 'visualizer' },
      { name: 'Atbash Cipher', section: 'visualizer' },
      { name: 'ROT13', section: 'visualizer' },
    ],
    concepts: ['Plaintext', 'Ciphertext', 'Key', 'Shift cipher', 'Brute force'],
    prerequisite: null,
  },
  {
    number: 2,
    title: 'Classical Ciphers',
    subtitle: 'Substitution & Transposition',
    level: 'Beginner',
    levelColor: 'bg-green-400',
    bgColor: 'bg-yellow-100',
    accentColor: 'bg-yellow-300',
    icon: <FlaskConical size={28} />,
    timeEstimate: '2–3 hours',
    description:
      "Level up to multi-key and scrambled-alphabet schemes. Explore how a keyword makes breaking the cipher much harder — and then learn frequency analysis to crack them anyway.",
    topics: [
      { name: 'Vigenère Cipher', section: 'visualizer' },
      { name: 'Affine Cipher', section: 'visualizer' },
      { name: 'Substitution Cipher', section: 'visualizer' },
      { name: 'Columnar Transposition', section: 'visualizer' },
      { name: 'Rail Fence', section: 'visualizer' },
    ],
    concepts: ['Polyalphabetic substitution', 'Key length', 'Frequency analysis', 'Kasiski test'],
    prerequisite: 'Stage 1',
  },
  {
    number: 3,
    title: 'Breaking Classical Ciphers',
    subtitle: 'Frequency Analysis',
    level: 'Beginner',
    levelColor: 'bg-green-400',
    bgColor: 'bg-orange-100',
    accentColor: 'bg-orange-300',
    icon: <Zap size={28} />,
    timeEstimate: '1–2 hours',
    description:
      "Flip sides — become the attacker. Use the built-in frequency analysis tool to crack Vigenère and substitution ciphers. Understand why letter frequency is a cipher's biggest enemy.",
    topics: [
      { name: 'Frequency Analysis Tool', section: 'visualizer' },
      { name: 'Vigenère (attack)', section: 'visualizer' },
    ],
    concepts: ['Letter frequency', 'Index of coincidence', 'Ciphertext-only attack', 'Statistical cryptanalysis'],
    prerequisite: 'Stage 2',
  },
  {
    number: 4,
    title: 'Symmetric Modern Ciphers',
    subtitle: 'XOR, DES, 3DES & AES',
    level: 'Intermediate',
    levelColor: 'bg-blue-400',
    bgColor: 'bg-cyan-100',
    accentColor: 'bg-cyan-300',
    icon: <Lock size={28} />,
    timeEstimate: '3–5 hours',
    description:
      "Transition into real-world cryptography. Start with XOR (the primitive underlying every modern cipher), then trace the evolution from DES → 3DES → AES. Understand block sizes, rounds, and why DES is broken.",
    topics: [
      { name: 'XOR Cipher', section: 'modern' },
      { name: 'DES', section: 'modern' },
      { name: '3DES', section: 'modern' },
      { name: 'AES-256', section: 'modern' },
    ],
    concepts: ['XOR operation', 'Block cipher', 'Feistel network', 'S-box', 'Key schedule', 'AES rounds', 'Modes of operation'],
    prerequisite: 'Stage 2',
  },
  {
    number: 5,
    title: 'Asymmetric Cryptography',
    subtitle: 'Public-Key Infrastructure',
    level: 'Intermediate',
    levelColor: 'bg-blue-400',
    bgColor: 'bg-purple-100',
    accentColor: 'bg-purple-300',
    icon: <Globe size={28} />,
    timeEstimate: '4–6 hours',
    description:
      "The invention that changed everything. Two people can share a secret over a public channel with no prior contact. Understand the maths behind RSA, Diffie-Hellman, and why elliptic curves are more efficient.",
    topics: [
      { name: 'Diffie-Hellman (DH)', section: 'modern' },
      { name: 'RSA', section: 'modern' },
      { name: 'ECDH', section: 'modern' },
    ],
    concepts: ['One-way function', 'Trapdoor', 'Modular arithmetic', 'Discrete logarithm', 'Elliptic curve', 'Public/private key pair'],
    prerequisite: 'Stage 4',
  },
  {
    number: 6,
    title: 'Cryptographic Hash Functions',
    subtitle: 'Integrity & Digital Signatures',
    level: 'Intermediate',
    levelColor: 'bg-blue-400',
    bgColor: 'bg-amber-100',
    accentColor: 'bg-amber-300',
    icon: <Cpu size={28} />,
    timeEstimate: '2–3 hours',
    description:
      "Hash functions are the backbone of password storage, digital signatures, and blockchains. Understand the avalanche effect, collision resistance, and why SHA-256 produces an unpredictable fingerprint.",
    topics: [
      { name: 'SHA-256', section: 'modern' },
    ],
    concepts: ['One-way function', 'Collision resistance', 'Avalanche effect', 'Message digest', 'Digital signature', 'HMAC'],
    prerequisite: 'Stage 5',
  },
  {
    number: 7,
    title: 'Historical Machine Ciphers',
    subtitle: 'The Enigma Machine',
    level: 'Intermediate',
    levelColor: 'bg-blue-400',
    bgColor: 'bg-pink-100',
    accentColor: 'bg-pink-300',
    icon: <FlaskConical size={28} />,
    timeEstimate: '2–3 hours',
    description:
      "A detour into history. The Enigma machine was the state-of-the-art in WWII cryptography — and cracking it at Bletchley Park changed the war. Simulate the rotors, plugboard, and double-stepping anomaly.",
    topics: [
      { name: 'Enigma Machine', section: 'modern' },
    ],
    concepts: ['Rotor cipher', 'Plugboard (Steckerbrett)', 'Double-stepping anomaly', 'Reflector', 'Bombe machine', 'Cribs'],
    prerequisite: 'Stage 4',
  },
  {
    number: 8,
    title: 'Post-Quantum Cryptography',
    subtitle: 'Lattices, Codes & NIST PQC',
    level: 'Advanced',
    levelColor: 'bg-rose-500',
    bgColor: 'bg-rose-100',
    accentColor: 'bg-rose-300',
    icon: <Atom size={28} />,
    timeEstimate: '5–8 hours',
    description:
      "Quantum computers will break RSA and ECDH. Explore the NIST-standardised replacement ML-KEM (Kyber) and the oldest post-quantum scheme McEliece — both based on hard mathematical problems that quantum computers cannot solve.",
    topics: [
      { name: 'Kyber / ML-KEM', section: 'modern' },
      { name: 'McEliece', section: 'modern' },
    ],
    concepts: ['Learning with Errors (LWE)', 'Lattice problem', 'CVP / SVP', 'Goppa code', 'Error-correcting codes', 'NIST FIPS 203', "Grover's algorithm"],
    prerequisite: 'Stages 5 & 6',
  },
  {
    number: 9,
    title: 'Quantum Cryptography',
    subtitle: 'BB84 & Quantum Key Distribution',
    level: 'Expert',
    levelColor: 'bg-sky-600',
    bgColor: 'bg-sky-100',
    accentColor: 'bg-sky-300',
    icon: <Atom size={28} />,
    timeEstimate: '3–5 hours',
    description:
      "Not just quantum-resistant — quantum-powered. BB84 uses the laws of physics (superposition, no-cloning theorem) to detect any eavesdropper. Toggle Eve and watch the error rate spike in real time.",
    topics: [
      { name: 'BB84 QKD', section: 'modern' },
    ],
    concepts: ['Qubit', 'Superposition', 'Measurement basis', 'No-cloning theorem', 'Sift & reconciliation', 'Information-theoretic security'],
    prerequisite: 'Stage 8',
  },
];

export default function RoadmapPage({ onNavigate }: RoadmapPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-black text-yellow-300 border-b-8 border-yellow-300 px-4 sm:px-8 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-yellow-300 text-black px-4 py-1 rounded-xl font-black uppercase text-sm border-4 border-yellow-300 shadow-[4px_4px_0px_0px_rgba(255,255,0,0.4)] mb-4">
            Learning Roadmap
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-tight mb-4">
            Your Path Through<br />
            <span className="text-yellow-300">Cryptography</span>
          </h1>
          <p className="text-white font-bold text-base sm:text-lg max-w-2xl leading-relaxed">
            9 stages taking you from shifting letters by hand all the way to quantum key distribution.
            Each stage builds on the last — follow in order or jump to what interests you.
          </p>
          {/* Level legend */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: 'Beginner', color: 'bg-green-400' },
              { label: 'Intermediate', color: 'bg-blue-400' },
              { label: 'Advanced', color: 'bg-rose-500' },
              { label: 'Expert', color: 'bg-sky-600' },
            ].map(({ label, color }) => (
              <span key={label} className={`${color} text-white border-2 border-white px-3 py-1 rounded-xl font-black text-xs uppercase`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] sm:left-[36px] top-0 bottom-0 w-1 bg-black hidden sm:block" />

          <div className="space-y-8 sm:space-y-12">
            {STAGES.map((stage, idx) => (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="flex gap-4 sm:gap-8"
              >
                {/* Stage number badge */}
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl border-4 border-black ${stage.accentColor} flex items-center justify-center font-black text-xl sm:text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 relative`}>
                    {stage.number}
                  </div>
                </div>

                {/* Card */}
                <div className={`flex-1 ${stage.bgColor} border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}>
                  {/* Card header */}
                  <div className={`${stage.accentColor} border-b-4 border-black px-4 sm:px-6 py-3 flex flex-col gap-2`}>
                    {/* Title row */}
                    <div className="flex items-start gap-2">
                      <div className="shrink-0 mt-0.5">{stage.icon}</div>
                      <div className="min-w-0">
                        <div className="font-black uppercase text-base sm:text-lg leading-tight">{stage.title}</div>
                        <div className="font-bold text-xs sm:text-sm text-black/70">{stage.subtitle}</div>
                      </div>
                    </div>
                    {/* Badges row — always on its own line */}
                    <div className="flex items-center gap-2">
                      <span className={`${stage.levelColor} text-white border-2 border-black px-2 py-0.5 rounded-lg font-black text-xs uppercase`}>
                        {stage.level}
                      </span>
                      <span className="bg-white border-2 border-black px-2 py-0.5 rounded-lg font-black text-xs flex items-center gap-1">
                        <Clock size={11} /> {stage.timeEstimate}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-4 sm:px-6 py-4 space-y-4">
                    <p className="font-bold text-sm leading-relaxed">{stage.description}</p>

                    {/* Prerequisite */}
                    {stage.prerequisite && (
                      <div className="bg-black/5 border-2 border-black/20 px-3 py-1.5 rounded-xl text-xs font-black uppercase inline-block">
                        Prerequisite: {stage.prerequisite}
                      </div>
                    )}

                    {/* Topics */}
                    <div>
                      <div className="font-black uppercase text-xs mb-2 text-black/60">Topics in this stage</div>
                      <div className="flex flex-wrap gap-2">
                        {stage.topics.map(topic => (
                          <button
                            key={topic.name}
                            onClick={() => onNavigate(topic.section)}
                            className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1.5 rounded-xl font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all uppercase"
                          >
                            {topic.name}
                            <ArrowRight size={11} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Concepts */}
                    <div>
                      <div className="font-black uppercase text-xs mb-2 text-black/60">Key concepts</div>
                      <div className="flex flex-wrap gap-1.5">
                        {stage.concepts.map(c => (
                          <span key={c} className="bg-black text-white px-2 py-0.5 rounded-lg font-bold text-xs">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-yellow-300 border-4 border-black p-6 sm:p-10 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-black uppercase mb-3">Ready to start?</h2>
          <p className="font-bold text-sm sm:text-base mb-6 max-w-xl mx-auto">
            Stage 1 takes less than 2 hours and requires zero maths background. Just pick a cipher and start exploring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('visualizer')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-black text-yellow-300 border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-2xl"
            >
              Start with Classical Ciphers <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('modern')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-black border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-2xl"
            >
              Jump to Modern Crypto <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
