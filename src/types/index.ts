export interface Frame {
  id: string;
  label: string;
  operationType: string;
  highlightIndices: number[];
  intermediateText: string;
  meta?: {
    calculation?: string;
    position?: { x: number; y: number };
    grid?: string[][];
    matrix?: number[][];
    [key: string]: any;
  };
}

export interface CharacterData {
  origChar: string;
  normalizedChar: string;
  index: number;
  stepHistory: {
    step: number;
    value: string;
    operation: string;
  }[];
}

export interface CipherOptions {
  preserveCase: boolean;
  keepNonLetters: boolean;
  mapJtoI: boolean;
  paddingChar: string;
  verbosity: 'beginner' | 'detailed';
  showMath: boolean;
  keyStreamBehavior?: 'skip' | 'consume';
}

export interface CipherResult {
  output: string;
  frames: Frame[];
  characters: CharacterData[];
}

export type CipherType = 
  | 'caesar'
  | 'affine'
  | 'atbash'
  | 'vigenere'
  | 'beaufort'
  | 'autokey'
  | 'playfair'
  | 'hill'
  | 'otp'
  | 'railfence'
  | 'columnar'
  | 'scytale'
  | 'adfgx'
  | 'adfgvx'
  | 'bacon'
  | 'homophonic';

export interface CipherConfig {
  type: CipherType;
  name: string;
  description: string;
  keyFields: {
    name: string;
    type: 'text' | 'number' | 'matrix';
    label: string;
    placeholder?: string;
    defaultValue?: string | number;
  }[];
}

export interface TestCase {
  cipher: CipherType;
  plaintext: string;
  key: any;
  expectedOutput: string;
  description: string;
}
