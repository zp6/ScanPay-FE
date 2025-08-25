// Wallet integration utilities and types for ScanPay
export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  balance: string
  balanceUSD: number
  priceUSD: number
  change24h: number
  logo?: string
}

export interface Chain {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  logo: string
  isTestnet?: boolean
}

export interface WalletBalance {
  chainId: number
  chainName: string
  totalBalanceUSD: number
  tokens: Token[]
}

// Mock data for demonstration
export const supportedChains: Chain[] = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    rpcUrl: "https://mainnet.infura.io/v3/",
    blockExplorer: "https://etherscan.io",
    logo: "⟠",
  },
  {
    id: 8453,
    name: "Base",
    symbol: "ETH",
    rpcUrl: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
    logo: "🔵",
  },
  {
    id: 10,
    name: "Optimism",
    symbol: "ETH",
    rpcUrl: "https://mainnet.optimism.io",
    blockExplorer: "https://optimistic.etherscan.io",
    logo: "🔴",
  },
  {
    id: 137,
    name: "Polygon",
    symbol: "MATIC",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
    logo: "🟣",
  },
  {
    id: 42161,
    name: "Arbitrum",
    symbol: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorer: "https://arbiscan.io",
    logo: "🔷",
  },
]

export const mockWalletBalances: WalletBalance[] = [
  {
    chainId: 1,
    chainName: "Ethereum",
    totalBalanceUSD: 4250.75,
    tokens: [
      {
        symbol: "ETH",
        name: "Ethereum",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        balance: "1.2345",
        balanceUSD: 2469.15,
        priceUSD: 2000.5,
        change24h: 2.5,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0xA0b86a33E6441b8e8C7C7b0b8e8C7C7b0b8e8C7C",
        decimals: 6,
        balance: "1500.00",
        balanceUSD: 1500.0,
        priceUSD: 1.0,
        change24h: 0.1,
      },
      {
        symbol: "UNI",
        name: "Uniswap",
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        decimals: 18,
        balance: "45.67",
        balanceUSD: 281.6,
        priceUSD: 6.17,
        change24h: -1.2,
      },
    ],
  },
  {
    chainId: 8453,
    chainName: "Base",
    totalBalanceUSD: 1850.25,
    tokens: [
      {
        symbol: "ETH",
        name: "Ethereum",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        balance: "0.8234",
        balanceUSD: 1647.25,
        priceUSD: 2000.5,
        change24h: 2.5,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: 6,
        balance: "203.00",
        balanceUSD: 203.0,
        priceUSD: 1.0,
        change24h: 0.1,
      },
    ],
  },
  {
    chainId: 137,
    chainName: "Polygon",
    totalBalanceUSD: 892.4,
    tokens: [
      {
        symbol: "MATIC",
        name: "Polygon",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        balance: "1250.75",
        balanceUSD: 892.4,
        priceUSD: 0.714,
        change24h: 3.2,
      },
    ],
  },
]

// Mock wallet service
export const walletService = {
  async getBalances(address: string): Promise<WalletBalance[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return mockWalletBalances
  },

  async getTokenPrice(symbol: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const prices: Record<string, number> = {
      ETH: 2000.5,
      USDC: 1.0,
      UNI: 6.17,
      MATIC: 0.714,
    }
    return prices[symbol] || 0
  },

  async estimateGas(chainId: number, transaction: any): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return "0.0021" // ETH
  },

  formatBalance(balance: string, decimals: number): string {
    const num = Number.parseFloat(balance)
    if (num === 0) return "0"
    if (num < 0.001) return "<0.001"
    if (num < 1) return num.toFixed(4)
    if (num < 1000) return num.toFixed(2)
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
    return `${(num / 1000000).toFixed(1)}M`
  },

  formatUSD(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  },
}
