import { useState } from 'react';
import { motion } from 'framer-motion';
import CipherSelector from './components/CipherSelector';
import CipherInput from './components/CipherInput';
import FrameVisualization from './components/FrameVisualization';
import AnimationControls from './components/AnimationControls';
import FrequencyAnalysis from './components/FrequencyAnalysis';
import CryptoHistoryCarousel from './components/CryptoHistoryCarousel';
import HeroLanding from './components/HeroLanding';
import ModernSection from './components/ModernSection';
import { CipherType, CipherOptions, Frame } from './types';
import { Download, Copy, Check, PersonStanding, Menu, X } from 'lucide-react';
import { exportFramesAsJSON, copyToClipboard, exportAsText } from './utils/export';

const defaultOptions: CipherOptions = {
  preserveCase: true,
  keepNonLetters: true,
  mapJtoI: true,
  paddingChar: 'X',
  verbosity: 'beginner',
  showMath: false,
  keyStreamBehavior: 'skip'
};

function App() {
  const [selectedCipher, setSelectedCipher] = useState<CipherType>('caesar');
  const [options, setOptions] = useState<CipherOptions>(defaultOptions);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentSection, setCurrentSection] = useState<'home' | 'visualizer' | 'modern' | 'about'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCopyOutput = async () => {
    const success = await copyToClipboard(ciphertext);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportJSON = () => {
    exportFramesAsJSON(frames, selectedCipher);
  };

  const handleExportText = () => {
    exportAsText(plaintext, ciphertext, selectedCipher);
  };

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Grid Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
      
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-yellow-300 border-b-4 border-black sticky top-0 z-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Name Only */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-black uppercase">
              CLASSCIPHER
            </h1>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setCurrentSection('home')}
                className={`px-4 lg:px-6 py-2 lg:py-3 font-black uppercase text-xs lg:text-sm border-4 border-black rounded-xl transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                  currentSection === 'home'
                    ? 'bg-black text-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => setCurrentSection('visualizer')}
                className={`px-4 lg:px-6 py-2 lg:py-3 font-black uppercase text-xs lg:text-sm border-4 border-black rounded-xl transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                  currentSection === 'visualizer'
                    ? 'bg-black text-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                Visualizer
              </button>
              
              <button
                onClick={() => setCurrentSection('modern')}
                className={`px-4 lg:px-6 py-2 lg:py-3 font-black uppercase text-xs lg:text-sm border-4 border-black rounded-xl transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                  currentSection === 'modern'
                    ? 'bg-black text-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                Modern Crypto
              </button>

              <button
                onClick={() => setCurrentSection('about')}
                className={`px-4 lg:px-6 py-2 lg:py-3 font-black uppercase text-xs lg:text-sm border-4 border-black rounded-xl transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                  currentSection === 'about'
                    ? 'bg-black text-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                About
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t-4 border-black border-x-4 border-b-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-b-2xl relative z-50"
            >
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => {
                    setCurrentSection('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 font-black uppercase text-sm border-4 border-black rounded-xl transition-all ${
                    currentSection === 'home'
                      ? 'bg-black text-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  Home
                </button>
                
                <button
                  onClick={() => {
                    setCurrentSection('visualizer');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 font-black uppercase text-sm border-4 border-black rounded-xl transition-all ${
                    currentSection === 'visualizer'
                      ? 'bg-black text-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  Visualizer
                </button>
                
                <button
                  onClick={() => {
                    setCurrentSection('modern');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 font-black uppercase text-sm border-4 border-black rounded-xl transition-all ${
                    currentSection === 'modern'
                      ? 'bg-black text-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  Modern Crypto
                </button>

                <button
                  onClick={() => {
                    setCurrentSection('about');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 font-black uppercase text-sm border-4 border-black rounded-xl transition-all ${
                    currentSection === 'about'
                      ? 'bg-black text-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  About
                </button>

                {/* Mobile Export Tools - Only show in visualizer section */}
                {currentSection === 'visualizer' && (
                  <div className="pt-3 border-t-2 border-black">
                    <div className="flex gap-3">
                      <button
                        onClick={handleCopyOutput}
                        disabled={!ciphertext}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-400 border-4 border-black text-black font-black uppercase text-xs disabled:opacity-30 disabled:cursor-not-allowed rounded-xl"
                        title="Copy output"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        Copy
                      </button>
                      <div className="relative group flex-1">
                        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-pink-400 border-4 border-black text-black font-black uppercase text-xs rounded-xl">
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                          <button
                            onClick={handleExportJSON}
                            disabled={frames.length === 0}
                            className="w-full px-3 py-2 text-left text-xs font-bold hover:bg-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-b-2 border-black"
                          >
                            JSON
                          </button>
                          <button
                            onClick={handleExportText}
                            disabled={!ciphertext}
                            className="w-full px-3 py-2 text-left text-xs font-bold hover:bg-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            Text
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Export Tools - Only show in visualizer section on desktop */}
        {currentSection === 'visualizer' && (
          <div className="hidden lg:flex items-center gap-3 absolute right-4 top-1/2 -translate-y-1/2">
            <button
                    onClick={handleCopyOutput}
                    disabled={!ciphertext}
                    className="p-3 bg-cyan-400 border-4 border-black rounded-xl hover:translate-x-1 hover:translate-y-1 transition-transform disabled:opacity-30 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    title="Copy output"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-black" />
                    ) : (
                      <Copy className="w-5 h-5 text-black" />
                    )}
                  </button>

                  <div className="relative group">
                    <button className="p-3 bg-pink-400 border-4 border-black rounded-xl hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                      <Download className="w-5 h-5 text-black" />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                      <button
                        onClick={handleExportJSON}
                        disabled={frames.length === 0}
                        className="w-full px-4 py-3 text-left text-sm font-bold hover:bg-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-b-2 border-black"
                      >
                        Export Frames (JSON)
                      </button>
                      <button
                        onClick={handleExportText}
                        disabled={!ciphertext}
                        className="w-full px-4 py-3 text-left text-sm font-bold hover:bg-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Export Text File
                      </button>
                    </div>
                  </div>
          </div>
        )}
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10">
        {currentSection === 'home' && (
          <>
            <HeroLanding 
              onGetStarted={() => setCurrentSection('visualizer')}
              onLearnMore={() => setCurrentSection('about')}
            />
            <CryptoHistoryCarousel />
          </>
        )}

        {currentSection === 'visualizer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Cipher Selection & Input */}
              <div className="lg:col-span-1 space-y-6">
                <CipherSelector
                  selectedCipher={selectedCipher}
                  onSelectCipher={setSelectedCipher}
                />

                <CipherInput
                  selectedCipher={selectedCipher}
                  options={options}
                  onOptionsChange={setOptions}
                  onGenerate={(result) => {
                    setFrames(result.frames);
                    setCiphertext(result.output);
                    setCurrentFrameIndex(0);
                  }}
                  plaintext={plaintext}
                  onPlaintextChange={setPlaintext}
                />

                <FrequencyAnalysis
                  plaintext={plaintext}
                  ciphertext={ciphertext}
                />
              </div>

              {/* Right Column - Visualization */}
              <div className="lg:col-span-2 space-y-6">
                <FrameVisualization
                  frames={frames}
                  currentFrameIndex={currentFrameIndex}
                  options={options}
                />

                <AnimationControls
                  frames={frames}
                  currentFrameIndex={currentFrameIndex}
                  onFrameChange={setCurrentFrameIndex}
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  playbackSpeed={playbackSpeed}
                  onSpeedChange={setPlaybackSpeed}
                />
              </div>
            </div>
        )}

        {currentSection === 'modern' && <ModernSection />}

        {currentSection === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-4 sm:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl"
            >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-black mb-6 sm:mb-8 uppercase">
              About ClassCipher
            </h2>
            
            <div className="space-y-6 sm:space-y-8">
              <p className="text-lg sm:text-xl lg:text-2xl text-black font-bold leading-relaxed">
                This interactive educational tool helps you understand classical encryption algorithms through step-by-step visualizations.
              </p>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-cyan-300 border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                  <h3 className="text-xl sm:text-2xl font-black text-black mb-3 sm:mb-4 flex items-center gap-2 uppercase">
                    <span className="text-2xl sm:text-3xl"></span>
                    Features
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base font-bold">
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>8 classical cipher visualizers with frame-by-frame playback</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>12 modern crypto schemes with animated step-through explanations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Real AES-256-GCM, RSA-2048, ECDH P-256 & SHA-256 via Web Crypto API</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Post-quantum cryptography: ML-KEM (Kyber) and McEliece explained</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>BB84 quantum key distribution simulation with Eve eavesdropping toggle</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Authentic Enigma machine simulation with rotor stepping & plugboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Frequency analysis, export (JSON/text/clipboard), keyboard controls</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-pink-300 border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                  <h3 className="text-xl sm:text-2xl font-black text-black mb-3 sm:mb-4 flex items-center gap-2 uppercase">
                    <span className="text-2xl sm:text-3xl"></span>
                    Technology Stack
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base font-bold">
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>React 18 with TypeScript</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Vite for fast development</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Tailwind CSS for styling</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Framer Motion for animations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Recharts for data visualization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-black text-xl mt-0.5">→</span>
                      <span>Vitest for testing</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cipher Explanations */}
              <div className="bg-green-300 border-4 border-black p-4 sm:p-6 lg:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                <h3 className="text-xl sm:text-2xl font-black text-black mb-4 sm:mb-6 flex items-center gap-2 uppercase">
                  How Each Cipher Works
                </h3>
                
                <div className="grid gap-4 sm:gap-6">
                  {/* Caesar Cipher */}
                  <div className="bg-white border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <h4 className="font-black text-black text-lg sm:text-xl mb-2 sm:mb-3 uppercase">Caesar Cipher</h4>
                    <p className="text-black font-bold text-sm sm:text-base leading-relaxed">
                      Each letter is shifted by a fixed number of positions in the alphabet. For example, with shift 3: 
                      A→D, B→E, C→F, etc. Wrapping around: X→A, Y→B, Z→C.
                    </p>
                  </div>

                  {/* Affine Cipher */}
                  <div className="bg-white border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <h4 className="font-black text-black text-lg sm:text-xl mb-2 sm:mb-3 uppercase">Affine Cipher</h4>
                    <p className="text-black font-bold text-sm sm:text-base leading-relaxed">
                      Uses the formula: E(x) = (ax + b) mod 26, where 'a' and 'b' are keys. 'a' must be coprime with 26. 
                      For decryption: D(y) = a⁻¹(y - b) mod 26, where a⁻¹ is the modular inverse of 'a'.
                    </p>
                  </div>

                  {/* Atbash Cipher */}
                  <div className="bg-white border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <h4 className="font-black text-black text-lg sm:text-xl mb-2 sm:mb-3 uppercase">Atbash Cipher</h4>
                    <p className="text-black font-bold text-sm sm:text-base leading-relaxed">
                      Simple substitution where each letter is mapped to its reverse in the alphabet: A↔Z, B↔Y, C↔X, etc. 
                      The cipher is symmetric - encryption and decryption use the same process.
                    </p>
                  </div>

                  {/* Vigenère Cipher */}
                  <div className="bg-white border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <h4 className="font-black text-black text-lg sm:text-xl mb-2 sm:mb-3 uppercase">Vigenère Cipher</h4>
                    <p className="text-black font-bold text-sm sm:text-base leading-relaxed">
                      Uses a keyword to determine the shift for each letter. The keyword is repeated to match the message length. 
                      Each letter is encrypted using a different Caesar shift based on the corresponding keyword letter.
                    </p>
                  </div>

                  {/* Playfair Cipher */}
                  <div className="bg-white border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <h4 className="font-black text-black text-lg sm:text-xl mb-2 sm:mb-3 uppercase">Playfair Cipher</h4>
                    <p className="text-black font-bold text-sm sm:text-base leading-relaxed">
                      Uses a 5×5 grid filled with a keyword (with duplicates removed). I and J share the same cell - 
                      <span className="bg-black text-green-300 px-1 py-0.5 border border-black">we use I in this implementation</span>. 
                      Text is split into digraphs and encrypted using grid rules for same-row, same-column, or rectangle pairs.
                    </p>
                  </div>

                  {/* Rail Fence Cipher */}
                  <div className="bg-white border-4 border-black p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                    <h4 className="font-black text-black text-lg sm:text-xl mb-2 sm:mb-3 uppercase">Rail Fence Cipher</h4>
                    <p className="text-black font-bold text-sm sm:text-base leading-relaxed">
                      Writes the message in a zigzag pattern across a specified number of "rails" (rows), then reads off 
                      the ciphertext row by row. The number of rails determines the pattern complexity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-200 border-4 border-black p-4 sm:p-6 lg:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                <h3 className="text-xl sm:text-2xl font-black text-black mb-3 sm:mb-4 flex items-center gap-2 uppercase">
                  Security Notice
                </h3>
                <p className="text-black font-bold text-sm sm:text-base lg:text-lg leading-relaxed">
                  Classical ciphers are <span className="bg-black text-yellow-300 px-1 sm:px-2 py-1 border-2 border-black">NOT SECURE</span> for modern use. They are easily broken with frequency analysis 
                  and other cryptanalysis techniques. This tool is for educational purposes only. Use modern cryptography 
                  (AES, RSA, etc.) for actual security needs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                <a
                  href="https://linktr.ee/Chef1t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white border-4 border-black text-black font-black uppercase hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-xl"
                >
                  <PersonStanding className="w-4 sm:w-5 h-4 sm:h-5" />
                  Meet the Creator
                </a>
                <button
                  onClick={() => setCurrentSection('visualizer')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-yellow-300 border-4 border-black font-black uppercase hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-xl"
                >
                  Try the Visualizer
                </button>
              </div>
            </div>
          </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 lg:mt-20 bg-black border-t-4 sm:border-t-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-300 border-4 border-yellow-300 flex items-center justify-center">
                  <span className="text-lg sm:text-2xl"></span>
                </div>
                <span className="font-black text-lg sm:text-xl lg:text-2xl text-yellow-300 uppercase">CLASSCIPHER</span>
              </div>
              <p className="text-white font-bold text-xs sm:text-sm">
                Learn classical cryptography through interactive visualizations and step-by-step demonstrations.
              </p>
            </div>
            <div>
              <h3 className="font-black text-yellow-300 mb-3 sm:mb-4 uppercase text-base sm:text-lg">Resources</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm font-bold">
                <li><a href="#" className="text-white hover:text-yellow-300 transition-colors">→ Documentation</a></li>
                <li><a href="#" className="text-white hover:text-yellow-300 transition-colors">→ Tutorials</a></li>
                <li><a href="#" className="text-white hover:text-yellow-300 transition-colors">→ Examples</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-yellow-300 mb-3 sm:mb-4 uppercase text-base sm:text-lg">Technology</h3>
              <p className="text-white font-bold text-xs sm:text-sm">
                Built with React, TypeScript, Tailwind CSS, and Framer Motion
              </p>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t-2 sm:border-t-4 border-yellow-300 text-center">
            <p className="text-white font-black uppercase text-xs sm:text-sm">© 2025 ClassCipher. Educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

