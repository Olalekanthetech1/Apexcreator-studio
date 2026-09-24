import { CryptoGatewaySettings } from '../types';

export const DEFAULT_CRYPTO_SETTINGS: CryptoGatewaySettings = {
  enabled: true,
  bybitApiKey: '',
  bybitApiSecret: '',
  autoVerifyWithBybit: true,
  coins: [
    {
      symbol: 'USDT',
      name: 'Tether USD',
      enabled: true,
      networks: [
        {
          id: 'TRC20',
          name: 'TRON (TRC20) - Low Fee & Fast',
          address: 'TJEETFXw2RnetGU9pUG3mSC8QSf4v2H2WJ',
          isActive: true
        },
        {
          id: 'BEP20',
          name: 'BNB Smart Chain (BEP20)',
          address: '0x32d12fd4f86780ca09808a58cc1a3c95a79e80fd',
          isActive: true
        },
        {
          id: 'ERC20',
          name: 'Ethereum (ERC20)',
          address: '0x32d12fd4f86780ca09808a58cc1a3c95a79e80fd',
          isActive: true
        },
        {
          id: 'SOL',
          name: 'Solana (SOL)',
          address: '6toFY8C4yyD5g1wdGkvULx4Hafh2SFA9sD3DY9bnZN5g',
          isActive: true
        }
      ]
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      enabled: true,
      networks: [
        {
          id: 'BTC',
          name: 'Bitcoin Native Network',
          address: '15UoFeFbNCzZnSGaxcrdzcKRQKw1nErZKq',
          isActive: true
        }
      ]
    },
    {
      symbol: 'TRX',
      name: 'TRON',
      enabled: true,
      networks: [
        {
          id: 'TRC20',
          name: 'TRON Network (TRC20)',
          address: 'TJEETFXw2RnetGU9pUG3mSC8QSf4v2H2WJ',
          isActive: true
        }
      ]
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      enabled: true,
      networks: [
        {
          id: 'ERC20',
          name: 'Ethereum Mainnet',
          address: '0x32d12fd4f86780ca09808a58cc1a3c95a79e80fd',
          isActive: true
        },
        {
          id: 'BEP20',
          name: 'BNB Smart Chain (BEP20)',
          address: '0x32d12fd4f86780ca09808a58cc1a3c95a79e80fd',
          isActive: true
        }
      ]
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      enabled: true,
      networks: [
        {
          id: 'SOL',
          name: 'Solana Network',
          address: '6toFY8C4yyD5g1wdGkvULx4Hafh2SFA9sD3DY9bnZN5g',
          isActive: true
        }
      ]
    },
    {
      symbol: 'LTC',
      name: 'Litecoin',
      enabled: true,
      networks: [
        {
          id: 'LTC',
          name: 'Litecoin Mainnet',
          address: 'LPbjd1fPrajjMpj34mgcdV3FRNmvJMazQt',
          isActive: true
        }
      ]
    },
    {
      symbol: 'BNB',
      name: 'BNB Coin',
      enabled: true,
      networks: [
        {
          id: 'BEP20',
          name: 'BNB Smart Chain (BEP20)',
          address: '0x32d12fd4f86780ca09808a58cc1a3c95a79e80fd',
          isActive: true
        }
      ]
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      enabled: true,
      networks: [
        {
          id: 'BEP20',
          name: 'BNB Smart Chain (BEP20)',
          address: '0x32d12fd4f86780ca09808a58cc1a3c95a79e80fd',
          isActive: true
        },
        {
          id: 'SOL',
          name: 'Solana (SOL)',
          address: '6toFY8C4yyD5g1wdGkvULx4Hafh2SFA9sD3DY9bnZN5g',
          isActive: true
        },
        {
          id: 'ERC20',
          name: 'Ethereum (ERC20)',
          address: '0x32d12fd4f86780ca09808a58cc1a3c95a79e80fd',
          isActive: true
        }
      ]
    }
  ]
};
