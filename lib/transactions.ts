// Transaction history and GraphQL integration for ScanPay
export interface Transaction {
  id: string
  hash: string
  type: "send" | "receive" | "swap" | "bridge"
  status: "completed" | "pending" | "failed"
  amount: string
  token: string
  tokenAddress: string
  from: string
  to: string
  timestamp: Date
  blockNumber: number
  gasUsed: string
  gasPrice: string
  chainId: number
  chainName: string
  usdValue: number
  memo?: string
  merchantName?: string
}

export interface TransactionFilter {
  type?: Transaction["type"]
  status?: Transaction["status"]
  chainId?: number
  dateFrom?: Date
  dateTo?: Date
  minAmount?: number
  maxAmount?: number
  search?: string
}

export interface PaginatedTransactions {
  transactions: Transaction[]
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  currentPage: number
  totalPages: number
}

// Transaction service with GraphQL integration
export const transactionService = {
  async getTransactions(page = 1, limit = 10, filter: TransactionFilter = {}): Promise<PaginatedTransactions> {
    // Return empty result when no API is connected yet
    return {
      transactions: [],
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: page,
      totalPages: 0,
    }
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    // Return null when no API is connected yet
    return null
  },

  formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    return date.toLocaleDateString()
  },

  getExplorerUrl(chainId: number, hash: string): string {
    const explorers: Record<number, string> = {
      1: "https://etherscan.io/tx/",
      8453: "https://basescan.org/tx/",
      10: "https://optimistic.etherscan.io/tx/",
      137: "https://polygonscan.com/tx/",
      42161: "https://arbiscan.io/tx/",
    }
    return `${explorers[chainId] || explorers[1]}${hash}`
  },
}
