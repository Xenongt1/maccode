import { describe, it, expect } from 'vitest';
import { caesarEncrypt, caesarDecrypt } from '../ciphers/caesar';
import { affineEncrypt, affineDecrypt } from '../ciphers/affine';
import { atbashCipher } from '../ciphers/atbash';
import { vigenereEncrypt, vigenereDecrypt } from '../ciphers/vigenere';
import { playfairEncrypt } from '../ciphers/playfair';
import { railFenceEncrypt, railFenceDecrypt } from '../ciphers/railfence';
import { CipherOptions } from '../types';

const defaultOptions: CipherOptions = {
  preserveCase: false,
  keepNonLetters: false,
  mapJtoI: true,
  paddingChar: 'X',
  verbosity: 'beginner',
  showMath: false,
  keyStreamBehavior: 'skip'
};

describe('Caesar Cipher', () => {
  it('should encrypt HELLO with shift 3 to KHOOR', () => {
    const result = caesarEncrypt('HELLO', 3, defaultOptions);
    expect(result.output).toBe('KHOOR');
    expect(result.frames.length).toBeGreaterThan(0);
  });

  it('should decrypt KHOOR with shift 3 to HELLO', () => {
    const result = caesarDecrypt('KHOOR', 3, defaultOptions);
    expect(result.output).toBe('HELLO');
  });

  it('should handle negative shifts', () => {
    const result = caesarEncrypt('HELLO', -3, defaultOptions);
    expect(result.output).toBe('EBIIL');
  });
});

describe('Affine Cipher', () => {
  it('should encrypt HELLO with a=5, b=8 to RCLLA', () => {
    const result = affineEncrypt('HELLO', 5, 8, defaultOptions);
    expect(result.output).toBe('RCLLA');
    expect(result.frames.length).toBeGreaterThan(0);
  });

  it('should decrypt RCLLA with a=5, b=8 to HELLO', () => {
    const result = affineDecrypt('RCLLA', 5, 8, defaultOptions);
    expect(result.output).toBe('HELLO');
  });

  it('should reject invalid multiplier (not coprime with 26)', () => {
    const result = affineEncrypt('HELLO', 2, 8, defaultOptions);
    expect(result.output).toBe('');
    expect(result.frames[0].operationType).toBe('error');
  });
});

describe('Atbash Cipher', () => {
  it('should transform HELLO to SVOOL', () => {
    const result = atbashCipher('HELLO', defaultOptions);
    expect(result.output).toBe('SVOOL');
    expect(result.frames.length).toBeGreaterThan(0);
  });

  it('should be reversible', () => {
    const encrypted = atbashCipher('HELLO', defaultOptions);
    const decrypted = atbashCipher(encrypted.output, defaultOptions);
    expect(decrypted.output).toBe('HELLO');
  });
});

describe('Vigenère Cipher', () => {
  it('should encrypt HELLO with key KEY to RIJVS', () => {
    const result = vigenereEncrypt('HELLO', 'KEY', defaultOptions);
    expect(result.output).toBe('RIJVS');
    expect(result.frames.length).toBeGreaterThan(0);
  });

  it('should decrypt RIJVS with key KEY to HELLO', () => {
    const result = vigenereDecrypt('RIJVS', 'KEY', defaultOptions);
    expect(result.output).toBe('HELLO');
  });

  it('should handle keys shorter than plaintext', () => {
    const result = vigenereEncrypt('HELLOWORLD', 'KEY', defaultOptions);
    expect(result.frames.length).toBeGreaterThan(0);
  });
});

describe('Playfair Cipher', () => {
  it('should encrypt HELLO with key MONARCHY', () => {
    const result = playfairEncrypt('HELLO', 'MONARCHY', defaultOptions);
    // Playfair pairs: HE LL O -> HE LX LO -> encrypted
    expect(result.output).toBe('CFSUPM');
    expect(result.frames.length).toBeGreaterThan(0);
  });

  it('should create proper 5x5 grid', () => {
    const result = playfairEncrypt('HI', 'MONARCHY', defaultOptions);
    const gridFrame = result.frames.find(f => f.meta?.grid);
    expect(gridFrame).toBeDefined();
    expect(gridFrame?.meta?.grid?.length).toBe(5);
    expect(gridFrame?.meta?.grid?.[0]?.length).toBe(5);
  });

  it('should handle J->I mapping', () => {
    const result = playfairEncrypt('JUMP', 'KEY', {
      ...defaultOptions,
      mapJtoI: true
    });
    expect(result.frames.length).toBeGreaterThan(0);
  });
});

describe('Rail Fence Cipher', () => {
  it('should encrypt HELLO with 3 rails to HOELL', () => {
    const result = railFenceEncrypt('HELLO', 3, defaultOptions);
    expect(result.output).toBe('HOELL');
    expect(result.frames.length).toBeGreaterThan(0);
  });

  it('should decrypt HOELL with 3 rails to HELLO', () => {
    const result = railFenceDecrypt('HOELL', 3, defaultOptions);
    expect(result.output).toBe('HELLO');
  });

  it('should reject invalid rail count', () => {
    const result = railFenceEncrypt('HELLO', 1, defaultOptions);
    expect(result.frames[0].operationType).toBe('error');
  });
});

describe('Frame Generation', () => {
  it('should generate frames for each step', () => {
    const result = caesarEncrypt('ABC', 1, defaultOptions);
    expect(result.frames.length).toBeGreaterThan(3); // init + 3 chars + complete
  });

  it('should include meta information in frames', () => {
    const result = caesarEncrypt('A', 1, defaultOptions);
    const charFrame = result.frames.find(f => f.operationType === 'encrypt');
    expect(charFrame?.meta).toBeDefined();
  });

  it('should respect verbosity settings', () => {
    const beginnerResult = caesarEncrypt('ABC', 1, defaultOptions);
    const detailedResult = caesarEncrypt('ABC', 1, {
      ...defaultOptions,
      verbosity: 'detailed'
    });
    expect(detailedResult.frames.length).toBeGreaterThanOrEqual(beginnerResult.frames.length);
  });
});
