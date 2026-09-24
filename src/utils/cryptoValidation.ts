export interface CryptoValidationResult {
  isValid: boolean;
  status: 'empty' | 'valid' | 'invalid' | 'mismatch';
  message: string;
  detectedType?: string;
}

const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]+$/;
const HEX_0X_REGEX = /^0x[0-9a-fA-F]{40}$/;

export function validateCryptoAddress(address: string, network: string): CryptoValidationResult {
  const trimmed = address.trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      status: 'empty',
      message: 'Address is empty (Hidden from checkout)'
    };
  }

  const net = network.toUpperCase();

  // 1. TRON (TRC20) Network Validation
  if (net === 'TRC20' || net === 'TRON') {
    if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
      return {
        isValid: false,
        status: 'mismatch',
        message: 'Network Mismatch: You pasted an EVM (0x...) address into TRC20 network!',
        detectedType: 'ERC20 / BEP20'
      };
    }
    if (!trimmed.startsWith('T')) {
      return {
        isValid: false,
        status: 'invalid',
        message: 'Invalid TRC20: TRON addresses must start with capital letter "T".'
      };
    }
    if (trimmed.length !== 34) {
      return {
        isValid: false,
        status: 'invalid',
        message: `Invalid TRC20 length: TRON addresses must be 34 characters (currently ${trimmed.length}).`
      };
    }
    if (!BASE58_REGEX.test(trimmed)) {
      return {
        isValid: false,
        status: 'invalid',
        message: 'Invalid TRC20 format: Contains invalid Base58 characters.'
      };
    }
    return {
      isValid: true,
      status: 'valid',
      message: 'Valid TRC20 (TRON) Address',
      detectedType: 'TRC20'
    };
  }

  // 2. EVM Networks (ERC20, BEP20, POLYGON, ARBITRUM)
  if (net === 'ERC20' || net === 'BEP20' || net === 'EVM' || net === 'ETH' || net === 'BNB') {
    if (trimmed.startsWith('T') && trimmed.length === 34) {
      return {
        isValid: false,
        status: 'mismatch',
        message: 'Network Mismatch: You pasted a TRON (TRC20) address starting with "T" into an EVM network!',
        detectedType: 'TRC20'
      };
    }
    if (!trimmed.startsWith('0x') && !trimmed.startsWith('0X')) {
      return {
        isValid: false,
        status: 'invalid',
        message: 'Invalid EVM format: Addresses must start with "0x".'
      };
    }
    if (!HEX_0X_REGEX.test(trimmed)) {
      return {
        isValid: false,
        status: 'invalid',
        message: `Invalid EVM format: Must be "0x" followed by exactly 40 hex characters (currently ${trimmed.length} chars).`
      };
    }
    return {
      isValid: true,
      status: 'valid',
      message: `Valid ${net} (EVM) Address`,
      detectedType: net
    };
  }

  // 3. Solana (SOL)
  if (net === 'SOL' || net === 'SOLANA') {
    if (trimmed.startsWith('0x') || trimmed.startsWith('T')) {
      return {
        isValid: false,
        status: 'mismatch',
        message: 'Network Mismatch: This looks like an EVM (0x) or TRON (T) address, not Solana!',
      };
    }
    if (trimmed.length < 32 || trimmed.length > 44 || !BASE58_REGEX.test(trimmed)) {
      return {
        isValid: false,
        status: 'invalid',
        message: 'Invalid Solana address format (32–44 Base58 characters).'
      };
    }
    return {
      isValid: true,
      status: 'valid',
      message: 'Valid Solana (SOL) Address',
      detectedType: 'SOL'
    };
  }

  // 4. Bitcoin (BTC)
  if (net === 'BTC' || net === 'BITCOIN') {
    const isBtcLegacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed);
    const isBtcBech32 = /^bc1[a-z0-9]{8,87}$/i.test(trimmed);
    if (!isBtcLegacy && !isBtcBech32) {
      return {
        isValid: false,
        status: 'invalid',
        message: 'Invalid Bitcoin address format (Must start with 1, 3, or bc1).'
      };
    }
    return {
      isValid: true,
      status: 'valid',
      message: 'Valid Bitcoin (BTC) Address',
      detectedType: 'BTC'
    };
  }

  // Default fallback length check for other cryptos
  if (trimmed.length < 12) {
    return {
      isValid: false,
      status: 'invalid',
      message: 'Address appears too short to be valid.'
    };
  }

  return {
    isValid: true,
    status: 'valid',
    message: 'Address format accepted'
  };
}
