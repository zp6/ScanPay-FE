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

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    hash: "0xabc123def456789012345678901234567890abcdef123456789012345678901234",
    type: "receive",
    status: "completed",
    amount: "0.5",
    token: "ETH",
    tokenAddress: "0x0000000000000000000000000000000000000000",
    from: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c",
    to: "0x123a456b789c012d345e678f901a234b567c890d",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    blockNumber: 18500000,
    gasUsed: "21000",
    gasPrice: "20000000000",
    chainId: 1,
    chainName: "Ethereum",
    usdValue: 1000.25,
    merchantName: "Coffee Shop",
    memo: "Latte payment",
  },
  {
    id: "2",
    hash: "0xdef456abc789012345678901234567890abcdef123456789012345678901234567",
    type: "send",
    status: "completed",
    amount: "100",
    token: "USDC",
    tokenAddress: "0xA0b86a33E6441b8e8C7C7b0b8e8C7C7b0b8e8C7C",
    from: "0x123a456b789c012d345e678f901a234b567c890d",
    to: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    blockNumber: 18499950,
    gasUsed: "65000",
    gasPrice: "18000000000",
    chainId: 1,
    chainName: "Ethereum",
    usdValue: 100.0,
  },
  {
    id: "3",
    hash: "0x789abc012345678901234567890abcdef123456789012345678901234567890def",
    type: "swap",
    status: "completed",
    amount: "250",
    token: "USDC → ETH",
    tokenAddress: "0xA0b86a33E6441b8e8C7C7b0b8e8C7C7b0b8e8C7C",
    from: "0x123a456b789c012d345e678f901a234b567c890d",
    to: "0x123a456b789c012d345e678f901a234b567c890d",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    blockNumber: 18495000,
    gasUsed: "150000",
    gasPrice: "25000000000",
    chainId: 1,
    chainName: "Ethereum",
    usdValue: 250.0,
  },
  {
    id: "4",
    hash: "0x012345678901234567890abcdef123456789012345678901234567890abcdef789",
    type: "bridge",
    status: "pending",
    amount: "0.25",
    token: "ETH",
    tokenAddress: "0x0000000000000000000000000000000000000000",
    from: "0x123a456b789c012d345e678f901a234b567c890d",
    to: "0x123a456b789c012d345e678f901a234b567c890d",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    blockNumber: 18490000,
    gasUsed: "180000",
    gasPrice: "30000000000",
    chainId: 8453,
    chainName: "Base",
    usdValue: 500.125,
  },
  {
    id: "5",
    hash: "0x345678901234567890abcdef123456789012345678901234567890abcdef012789",
    type: "send",
    status: "failed",
    amount: "50",
    token: "MATIC",
    tokenAddress: "0x0000000000000000000000000000000000000000",
    from: "0x123a456b789c012d345e678f901a234b567c890d",
    to: "0x456b789c012d345e678f901a234b567c890d123a",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    blockNumber: 18485000,
    gasUsed: "0",
    gasPrice: "20000000000",
    chainId: 137,
    chainName: "Polygon",
    usdValue: 35.7,
  },
]

// Transaction service with GraphQL simulation
export const transactionService = {
  async getTransactions(page = 1, limit = 10, filter: TransactionFilter = {}): Promise<PaginatedTransactions> {
    // Simulate GraphQL query delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    let filteredTransactions = [...mockTransactions]

    // Apply filters
    if (filter.type) {
      filteredTransactions = filteredTransactions.filter((tx) => tx.type === filter.type)
    }
    if (filter.status) {
      filteredTransactions = filteredTransactions.filter((tx) => tx.status === filter.status)
    }
    if (filter.chainId) {
      filteredTransactions = filteredTransactions.filter((tx) => tx.chainId === filter.chainId)
    }
    if (filter.dateFrom) {
      filteredTransactions = filteredTransactions.filter((tx) => tx.timestamp >= filter.dateFrom!)
    }
    if (filter.dateTo) {
      filteredTransactions = filteredTransactions.filter((tx) => tx.timestamp <= filter.dateTo!)
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      filteredTransactions = filteredTransactions.filter(
        (tx) =>
          tx.hash.toLowerCase().includes(searchLower) ||
          tx.token.toLowerCase().includes(searchLower) ||
          tx.merchantName?.toLowerCase().includes(searchLower) ||
          tx.memo?.toLowerCase().includes(searchLower),
      )
    }

    // Sort by timestamp (newest first)
    filteredTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Pagination
    const totalCount = filteredTransactions.length
    const totalPages = Math.ceil(totalCount / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const transactions = filteredTransactions.slice(startIndex, endIndex)

    return {
      transactions,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages,
    }
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockTransactions.find((tx) => tx.id === id) || null
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
