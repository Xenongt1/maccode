// Utility functions for cipher operations

export const mod = (n: number, m: number): number => {
  return ((n % m) + m) % m;
};

export const charToNum = (char: string): number => {
  return char.toUpperCase().charCodeAt(0) - 65;
};

export const numToChar = (num: number): string => {
  return String.fromCharCode(mod(num, 26) + 65);
};

export const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

export const modInverse = (a: number, m: number): number => {
  if (gcd(a, m) !== 1) {
    throw new Error(`No modular inverse exists for ${a} mod ${m}`);
  }
  
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) {
      return x;
    }
  }
  
  throw new Error(`Could not find modular inverse for ${a} mod ${m}`);
};

export const matrixMultiply = (matrix: number[][], vector: number[]): number[] => {
  return matrix.map(row => 
    mod(row.reduce((sum, val, i) => sum + val * vector[i], 0), 26)
  );
};

export const matrixDeterminant = (matrix: number[][]): number => {
  if (matrix.length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }
  
  let det = 0;
  for (let i = 0; i < matrix.length; i++) {
    const minor = matrix.slice(1).map(row => 
      row.filter((_, j) => j !== i)
    );
    det += Math.pow(-1, i) * matrix[0][i] * matrixDeterminant(minor);
  }
  
  return det;
};

export const matrixInverse = (matrix: number[][]): number[][] => {
  const n = matrix.length;
  
  if (n === 2) {
    const det = mod(matrixDeterminant(matrix), 26);
    const detInv = modInverse(det, 26);
    
    return [
      [mod(matrix[1][1] * detInv, 26), mod(-matrix[0][1] * detInv, 26)],
      [mod(-matrix[1][0] * detInv, 26), mod(matrix[0][0] * detInv, 26)]
    ];
  }
  
  throw new Error('Matrix inversion only supported for 2x2 matrices');
};

export const isMatrixInvertible = (matrix: number[][]): boolean => {
  try {
    const det = mod(matrixDeterminant(matrix), 26);
    return gcd(det, 26) === 1;
  } catch {
    return false;
  }
};

export const normalizeText = (text: string, options: {
  keepNonLetters?: boolean;
  mapJtoI?: boolean;
  toUpper?: boolean;
}): string => {
  let result = options.toUpper !== false ? text.toUpperCase() : text;
  
  if (options.mapJtoI) {
    result = result.replace(/J/g, 'I');
  }
  
  if (!options.keepNonLetters) {
    result = result.replace(/[^A-Z]/g, '');
  }
  
  return result;
};

export const createGrid = (size: number, fillValue: string = ''): string[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(fillValue));
};

export const generateRandomKey = (length: number): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return key;
};
