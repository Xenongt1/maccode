import { Frame, CipherOptions, CipherResult, CharacterData } from '../types';

function getColumnOrder(key: string): number[] {
  const chars = key.toUpperCase().replace(/[^A-Z]/g, '').split('');
  return chars
    .map((c, i) => ({ c, i }))
    .sort((a, b) => (a.c < b.c ? -1 : a.c > b.c ? 1 : a.i - b.i))
    .map(({ i }) => i);
}

export const columnarEncrypt = (
  plaintext: string,
  key: string,
  options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];

  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  const cleaned = options.keepNonLetters
    ? plaintext.toUpperCase()
    : plaintext.toUpperCase().replace(/[^A-Z]/g, '');

  const cols = cleanKey.length;
  const rows = Math.ceil(cleaned.length / cols);
  const padded = cleaned.padEnd(rows * cols, 'X');
  const order = getColumnOrder(cleanKey);

  // Build grid
  const grid: string[][] = [];
  for (let r = 0; r < rows; r++) {
    grid.push(padded.slice(r * cols, r * cols + cols).split(''));
  }

  frames.push({
    id: 'init',
    label: 'Write Plaintext into Grid',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: padded,
    meta: {
      grid,
      calculation: `Key: "${cleanKey}" | ${rows} rows × ${cols} cols. Reading left-to-right, top-to-bottom.`,
    },
  });

  // Show key order
  const keyOrder = cleanKey.split('').map((c, i) => `${c}→${order.indexOf(i) + 1}`).join(', ');
  frames.push({
    id: 'keyorder',
    label: 'Determine Column Read Order',
    operationType: 'analyze',
    highlightIndices: [],
    intermediateText: padded,
    meta: {
      grid,
      calculation: `Alphabetical ranking of key letters: ${keyOrder}`,
    },
  });

  // Read off columns in key order
  let result = '';
  for (const colIdx of order) {
    const colLetters = grid.map(row => row[colIdx]).join('');
    result += colLetters;

    frames.push({
      id: `col-${colIdx}`,
      label: `Read column "${cleanKey[colIdx]}" (rank ${order.indexOf(colIdx) + 1})`,
      operationType: 'encrypt',
      highlightIndices: grid.map((_, r) => r * cols + colIdx),
      intermediateText: result,
      meta: {
        grid,
        calculation: `Column ${colIdx + 1} ("${cleanKey[colIdx]}"): ${colLetters}`,
      },
    });

    grid.map((_, r) => {
      characters.push({
        origChar: grid[r][colIdx],
        normalizedChar: grid[r][colIdx],
        index: r * cols + colIdx,
        stepHistory: [
          { step: 0, value: grid[r][colIdx], operation: `Grid[${r}][${colIdx}]` },
          { step: 1, value: grid[r][colIdx], operation: `Written to output` },
        ],
      });
    });
  }

  frames.push({
    id: 'complete',
    label: 'Encryption Complete',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: { grid, calculation: `Ciphertext: ${result}` },
  });

  return { output: result, frames, characters };
};

export const columnarDecrypt = (
  ciphertext: string,
  key: string,
  _options: CipherOptions
): CipherResult => {
  const frames: Frame[] = [];
  const characters: CharacterData[] = [];

  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
  const cleaned = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  const cols = cleanKey.length;
  const rows = Math.ceil(cleaned.length / cols);
  const order = getColumnOrder(cleanKey);

  frames.push({
    id: 'init',
    label: 'Determine Grid Dimensions',
    operationType: 'init',
    highlightIndices: [],
    intermediateText: cleaned,
    meta: {
      calculation: `Key: "${cleanKey}" | Grid: ${rows} rows × ${cols} cols | Total: ${rows * cols} cells`,
    },
  });

  // Fill columns in key order
  const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));
  let idx = 0;
  for (const colIdx of order) {
    for (let r = 0; r < rows; r++) {
      grid[r][colIdx] = cleaned[idx++] || 'X';
    }

    frames.push({
      id: `fill-${colIdx}`,
      label: `Fill column "${cleanKey[colIdx]}" (rank ${order.indexOf(colIdx) + 1})`,
      operationType: 'decrypt',
      highlightIndices: [],
      intermediateText: grid.map(r => r.join('')).join(''),
      meta: {
        grid: grid.map(r => [...r]),
        calculation: `Filling column ${colIdx + 1} ("${cleanKey[colIdx]}") with next ${rows} ciphertext letters`,
      },
    });
  }

  // Read row by row
  let result = grid.map(row => row.join('')).join('').replace(/X+$/, '');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      characters.push({
        origChar: grid[r][c],
        normalizedChar: grid[r][c],
        index: r * cols + c,
        stepHistory: [{ step: 0, value: grid[r][c], operation: `Grid[${r}][${c}]` }],
      });
    }
  }

  frames.push({
    id: 'read',
    label: 'Read Grid Row by Row',
    operationType: 'complete',
    highlightIndices: [],
    intermediateText: result,
    meta: {
      grid,
      calculation: `Reading grid left-to-right, top-to-bottom. Trailing X padding removed. Plaintext: ${result}`,
    },
  });

  return { output: result, frames, characters };
};
