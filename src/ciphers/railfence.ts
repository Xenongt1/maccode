import { Frame, CipherOptions, CipherResult, CharacterData } from '../types';
import { normalizeText } from '../utils/helpers';

export const railFenceEncrypt = (
  plaintext: string,
  rails: number,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  if (rails < 2) {
    frames.push({
      id: 'error',
      label: 'Invalid Rails',
      operationType: 'error',
      highlightIndices: [],
      intermediateText: '',
      meta: { calculation: 'Error: Number of rails must be at least 2' }
    });
    return { output: '', frames, characters };
  }
  
  const normalized = normalizeText(plaintext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase
  });
  
  if (normalized.length === 0) {
    return { output: '', frames, characters };
  }
  
  // Create rail fence grid
  const fence: string[][] = Array(rails).fill(null).map(() => Array(normalized.length).fill(''));
  
  let rail = 0;
  let direction = 1; // 1 for down, -1 for up
  
  frames.push({
    id: 'init',
    label: `Initialize Rail Fence with ${rails} rails`,
    operationType: 'init',
    highlightIndices: [],
    intermediateText: normalized,
    meta: {
      calculation: `Creating zigzag pattern across ${rails} rails`
    }
  });
  
  // Place characters in zigzag pattern
  for (let i = 0; i < normalized.length; i++) {
    fence[rail][i] = normalized[i];
    
    frames.push({
      id: `place-${i}`,
      label: `Place '${normalized[i]}' on rail ${rail + 1}`,
      operationType: 'place',
      highlightIndices: [i],
      intermediateText: '',
      meta: {
        grid: fence.map(row => [...row]),
        calculation: `Character '${normalized[i]}' → Rail ${rail + 1}, Position ${i}`,
        currentRail: rail
      }
    });
    
    // Change direction at top and bottom rails
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  // Read off rails to create ciphertext
  let result = '';
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < normalized.length; c++) {
      if (fence[r][c] !== '') {
        result += fence[r][c];
      }
    }
  }
  
  frames.push({
    id: 'read',
    label: 'Read rails from top to bottom',
    operationType: 'read',
    highlightIndices: [],
    intermediateText: result,
    meta: {
      grid: fence,
      calculation: 'Read each rail left to right, concatenate'
    }
  });
  
  frames.push({
    id: 'complete',
    label: 'Encryption Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: { calculation: `Final ciphertext: ${result}` }
  });
  
  return { output: result, frames, characters };
};

export const railFenceDecrypt = (
  ciphertext: string,
  rails: number,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  if (rails < 2) {
    frames.push({
      id: 'error',
      label: 'Invalid Rails',
      operationType: 'error',
      highlightIndices: [],
      intermediateText: '',
      meta: { calculation: 'Error: Number of rails must be at least 2' }
    });
    return { output: '', frames, characters };
  }
  
  const normalized = normalizeText(ciphertext, {
    keepNonLetters: options.keepNonLetters,
    toUpper: !options.preserveCase
  });
  
  if (normalized.length === 0) {
    return { output: '', frames, characters };
  }
  
  // Create rail fence pattern to know where chars go
  const fence: boolean[][] = Array(rails).fill(null).map(() => Array(normalized.length).fill(false));
  
  let rail = 0;
  let direction = 1;
  
  // Mark positions in zigzag
  for (let i = 0; i < normalized.length; i++) {
    fence[rail][i] = true;
    
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  // Fill the fence with ciphertext
  const fenceChars: string[][] = Array(rails).fill(null).map(() => Array(normalized.length).fill(''));
  let index = 0;
  
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < normalized.length; c++) {
      if (fence[r][c] && index < normalized.length) {
        fenceChars[r][c] = normalized[index++];
      }
    }
  }
  
  frames.push({
    id: 'fill',
    label: 'Fill rail fence with ciphertext',
    operationType: 'fill',
    highlightIndices: [],
    intermediateText: '',
    meta: {
      grid: fenceChars,
      calculation: 'Distribute ciphertext across rails'
    }
  });
  
  // Read in zigzag pattern
  let result = '';
  rail = 0;
  direction = 1;
  
  for (let i = 0; i < normalized.length; i++) {
    result += fenceChars[rail][i];
    
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  frames.push({
    id: 'complete',
    label: 'Decryption Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: { calculation: `Final plaintext: ${result}` }
  });
  
  return { output: result, frames, characters };
};
