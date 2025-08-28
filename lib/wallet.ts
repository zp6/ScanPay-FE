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

// Supported chains configuration
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

// Wallet service
export const walletService = {
  async getBalances(address: string): Promise<WalletBalance[]> {
    console.warn("Wallet service not implemented - connect to thirdweb SDK")
    return []
  },

  async getTokenPrice(symbol: string): Promise<number> {
    console.warn("Price service not implemented - connect to price API")
    return 0
  },

  async estimateGas(chainId: number, transaction: any): Promise<string> {
    console.warn("Gas estimation not implemented - connect to Web3 provider")
    return "0.001"
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
