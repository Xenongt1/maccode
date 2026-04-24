import { Frame, CipherOptions, CipherResult, CharacterData } from '../types';
import { normalizeText, createGrid } from '../utils/helpers';

const createPlayfairGrid = (key: string, mapJtoI: boolean): string[][] => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const grid = createGrid(5);
  const used = new Set<string>();
  
  let keyStr = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (mapJtoI) {
    keyStr = keyStr.replace(/J/g, 'I');
  }
  
  let position = 0;
  
  // Add key characters
  for (const char of keyStr) {
    if (!used.has(char)) {
      grid[Math.floor(position / 5)][position % 5] = char;
      used.add(char);
      position++;
    }
  }
  
  // Fill remaining with alphabet
  for (const char of alphabet) {
    const useChar = (mapJtoI && char === 'J') ? 'I' : char;
    if (!used.has(useChar)) {
      if (position >= 25) break;
      grid[Math.floor(position / 5)][position % 5] = useChar;
      used.add(useChar);
      position++;
    }
  }
  
  return grid;
};

const findPosition = (grid: string[][], char: string): [number, number] => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (grid[row][col] === char) {
        return [row, col];
      }
    }
  }
  return [-1, -1];
};

const preparePairs = (text: string, paddingChar: string): string[] => {
  const pairs: string[] = [];
  let i = 0;
  
  while (i < text.length) {
    let first = text[i];
    let second = i + 1 < text.length ? text[i + 1] : paddingChar;
    
    if (first === second) {
      second = paddingChar;
      i++;
    } else {
      i += 2;
    }
    
    pairs.push(first + second);
  }
  
  return pairs;
};

export const playfairEncrypt = (
  plaintext: string,
  key: string,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  let normalized = normalizeText(plaintext, {
    keepNonLetters: false,
    toUpper: true,
    mapJtoI: options.mapJtoI
  });
  
  const grid = createPlayfairGrid(key, options.mapJtoI);
  
  frames.push({
    id: 'grid',
    label: 'Create 5×5 Playfair Grid',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: '',
    meta: {
      grid: grid,
      calculation: `Generated grid from key: "${key}"`
    }
  });
  
  const pairs = preparePairs(normalized, options.paddingChar);
  
  frames.push({
    id: 'pairs',
    label: 'Create Digraph Pairs',
    operationType: 'prepare',
    highlightIndices: [],
    intermediateText: pairs.join(' '),
    meta: {
      calculation: `Digraphs: ${pairs.join(', ')}`
    }
  });
  
  let result = '';
  
  for (let pairIdx = 0; pairIdx < pairs.length; pairIdx++) {
    const pair = pairs[pairIdx];
    const [char1, char2] = [pair[0], pair[1]];
    
    const [row1, col1] = findPosition(grid, char1);
    const [row2, col2] = findPosition(grid, char2);
    
    let encrypted1: string, encrypted2: string;
    let ruleUsed: string;
    
    if (row1 === row2) {
      // Same row - shift right
      encrypted1 = grid[row1][(col1 + 1) % 5];
      encrypted2 = grid[row2][(col2 + 1) % 5];
      ruleUsed = 'Same row - shift right';
    } else if (col1 === col2) {
      // Same column - shift down
      encrypted1 = grid[(row1 + 1) % 5][col1];
      encrypted2 = grid[(row2 + 1) % 5][col2];
      ruleUsed = 'Same column - shift down';
    } else {
      // Rectangle - swap columns
      encrypted1 = grid[row1][col2];
      encrypted2 = grid[row2][col1];
      ruleUsed = 'Rectangle - swap columns';
    }
    
    result += encrypted1 + encrypted2;
    
    frames.push({
      id: `pair-${pairIdx}`,
      label: `Encrypt '${pair}' → '${encrypted1}${encrypted2}'`,
      operationType: 'encrypt',
      highlightIndices: [pairIdx * 2, pairIdx * 2 + 1],
      intermediateText: result,
      meta: {
        grid: grid,
        calculation: `${char1}[${row1},${col1}] ${char2}[${row2},${col2}] → ${encrypted1}${encrypted2} (${ruleUsed})`,
        positions: [[row1, col1], [row2, col2]]
      }
    });
  }
  
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

export const playfairDecrypt = (
  ciphertext: string,
  key: string,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];
  
  let normalized = normalizeText(ciphertext, {
    keepNonLetters: false,
    toUpper: true,
    mapJtoI: options.mapJtoI
  });
  
  const grid = createPlayfairGrid(key, options.mapJtoI);
  
  frames.push({
    id: 'grid',
    label: 'Create 5×5 Playfair Grid',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: '',
    meta: {
      grid: grid,
      calculation: `Generated grid from key: "${key}"`
    }
  });
  
  // For decryption, we already have pairs
  const pairs: string[] = [];
  for (let i = 0; i < normalized.length; i += 2) {
    if (i + 1 < normalized.length) {
      pairs.push(normalized[i] + normalized[i + 1]);
    }
  }
  
  let result = '';
  
  for (let pairIdx = 0; pairIdx < pairs.length; pairIdx++) {
    const pair = pairs[pairIdx];
    const [char1, char2] = [pair[0], pair[1]];
    
    const [row1, col1] = findPosition(grid, char1);
    const [row2, col2] = findPosition(grid, char2);
    
    let decrypted1: string, decrypted2: string;
    let ruleUsed: string;
    
    if (row1 === row2) {
      // Same row - shift left
      decrypted1 = grid[row1][(col1 + 4) % 5];
      decrypted2 = grid[row2][(col2 + 4) % 5];
      ruleUsed = 'Same row - shift left';
    } else if (col1 === col2) {
      // Same column - shift up
      decrypted1 = grid[(row1 + 4) % 5][col1];
      decrypted2 = grid[(row2 + 4) % 5][col2];
      ruleUsed = 'Same column - shift up';
    } else {
      // Rectangle - swap columns
      decrypted1 = grid[row1][col2];
      decrypted2 = grid[row2][col1];
      ruleUsed = 'Rectangle - swap columns';
    }
    
    result += decrypted1 + decrypted2;
    
    frames.push({
      id: `pair-${pairIdx}`,
      label: `Decrypt '${pair}' → '${decrypted1}${decrypted2}'`,
      operationType: 'decrypt',
      highlightIndices: [pairIdx * 2, pairIdx * 2 + 1],
      intermediateText: result,
      meta: {
        grid: grid,
        calculation: `${char1}[${row1},${col1}] ${char2}[${row2},${col2}] → ${decrypted1}${decrypted2} (${ruleUsed})`,
        positions: [[row1, col1], [row2, col2]]
      }
    });
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
