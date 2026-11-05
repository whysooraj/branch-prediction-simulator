import { describe, it, expect } from 'vitest';
import { validateAndNormalizeSequence } from '../engine/validateSequence';

describe('validateAndNormalizeSequence', () => {
  it('parses unspaced uppercase string TTNTNNTT', () => {
    const res = validateAndNormalizeSequence('TTNTNNTT');
    expect(res.isValid).toBe(true);
    expect(res.sequence).toEqual(['T', 'T', 'N', 'T', 'N', 'N', 'T', 'T']);
    expect(res.rawCleaned).toBe('T T N T N N T T');
  });

  it('parses space-separated string', () => {
    const res = validateAndNormalizeSequence('T T N T N N T T');
    expect(res.isValid).toBe(true);
    expect(res.sequence).toEqual(['T', 'T', 'N', 'T', 'N', 'N', 'T', 'T']);
  });

  it('normalizes lowercase letters and comma separators', () => {
    const res = validateAndNormalizeSequence('t, t, n, t, n, n, t, t');
    expect(res.isValid).toBe(true);
    expect(res.sequence).toEqual(['T', 'T', 'N', 'T', 'N', 'N', 'T', 'T']);
  });

  it('handles bracketed and quoted input formats', () => {
    const res = validateAndNormalizeSequence('["T", "T", "N", "T"]');
    expect(res.isValid).toBe(true);
    expect(res.sequence).toEqual(['T', 'T', 'N', 'T']);
  });

  it('rejects empty input with descriptive message', () => {
    const res = validateAndNormalizeSequence('   ');
    expect(res.isValid).toBe(false);
    expect(res.sequence).toEqual([]);
    expect(res.errorMessage).toBeDefined();
  });

  it('rejects invalid characters like numbers or illegal letters', () => {
    const res = validateAndNormalizeSequence('T T X 1 N');
    expect(res.isValid).toBe(false);
    expect(res.errorMessage).toContain('Invalid characters');
  });
});
