import { BranchOutcome } from '../types';

export interface ValidationResult {
  isValid: boolean;
  sequence: BranchOutcome[];
  rawCleaned: string;
  errorMessage?: string;
}

export function validateAndNormalizeSequence(input: string): ValidationResult {
  if (!input || input.trim() === '') {
    return {
      isValid: false,
      sequence: [],
      rawCleaned: '',
      errorMessage: 'Branch sequence cannot be empty. Enter T and N values (e.g. TTNTNNTT).',
    };
  }

  // Remove brackets, quotes, commas, and excessive whitespace
  const sanitized = input
    .replace(/[\[\]"',]/g, ' ')
    .trim()
    .toUpperCase();

  // Split on whitespace or match individual characters if no spaces
  let tokens: string[] = [];
  if (sanitized.includes(' ')) {
    tokens = sanitized.split(/\s+/).filter(Boolean);
  } else {
    tokens = sanitized.split('');
  }

  const invalidTokens: string[] = [];
  const sequence: BranchOutcome[] = [];

  for (const token of tokens) {
    if (token === 'T' || token === 'N') {
      sequence.push(token);
    } else {
      invalidTokens.push(token);
    }
  }

  if (invalidTokens.length > 0) {
    return {
      isValid: false,
      sequence: [],
      rawCleaned: sanitized,
      errorMessage: `Invalid characters found: "${invalidTokens.slice(0, 5).join(', ')}". Allowed values are only T (Taken) and N (Not Taken).`,
    };
  }

  if (sequence.length === 0) {
    return {
      isValid: false,
      sequence: [],
      rawCleaned: sanitized,
      errorMessage: 'No valid branch outcomes found in sequence.',
    };
  }

  return {
    isValid: true,
    sequence,
    rawCleaned: sequence.join(' '),
  };
}
