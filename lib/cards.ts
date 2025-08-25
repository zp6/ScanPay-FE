// Card management utilities for ScanPay
export interface Card {
  id: string
  type: "virtual" | "physical"
  status: "active" | "inactive" | "blocked" | "pending"
  last4: string
  brand: "visa" | "mastercard" | "amex"
  expiryMonth: number
  expiryYear: number
  spendLimit: {
    daily: number
    monthly: number
    perTransaction: number
  }
  balance: number
  createdAt: Date
  nickname?: string
  isDefault: boolean
}

export interface CardTransaction {
  id: string
  cardId: string
  amount: number
  merchant: string
  category: string
  timestamp: Date
  status: "completed" | "pending" | "declined"
  location?: string
}

// Mock card data
const mockCards: Card[] = [
  {
    id: "card1",
    type: "virtual",
    status: "active",
    last4: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2027,
    spendLimit: {
      daily: 1000,
      monthly: 5000,
      perTransaction: 500,
    },
    balance: 2500.75,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    nickname: "Main Card",
    isDefault: true,
  },
  {
    id: "card2",
    type: "physical",
    status: "pending",
    last4: "8888",
    brand: "mastercard",
    expiryMonth: 6,
    expiryYear: 2028,
    spendLimit: {
      daily: 500,
      monthly: 2000,
      perTransaction: 200,
    },
    balance: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    nickname: "Travel Card",
    isDefault: false,
  },
]

const mockCardTransactions: CardTransaction[] = [
  {
    id: "tx1",
    cardId: "card1",
    amount: 4.5,
    merchant: "Starbucks",
    category: "Food & Drink",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: "completed",
    location: "New York, NY",
  },
  {
    id: "tx2",
    cardId: "card1",
    amount: 25.99,
    merchant: "Amazon",
    category: "Shopping",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "completed",
  },
  {
    id: "tx3",
    cardId: "card1",
    amount: 12.0,
    merchant: "Uber",
    category: "Transportation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "completed",
    location: "San Francisco, CA",
  },
]

// Card service
export const cardService = {
  async getCards(): Promise<Card[]> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return [...mockCards]
  },

  async createCard(type: "virtual" | "physical", nickname?: string): Promise<Card> {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newCard: Card = {
      id: `card${Date.now()}`,
      type,
      status: type === "virtual" ? "active" : "pending",
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      brand: Math.random() > 0.5 ? "visa" : "mastercard",
      expiryMonth: Math.floor(1 + Math.random() * 12),
      expiryYear: new Date().getFullYear() + Math.floor(3 + Math.random() * 3),
      spendLimit: {
        daily: 1000,
        monthly: 5000,
        perTransaction: 500,
      },
      balance: 0,
      createdAt: new Date(),
      nickname,
      isDefault: false,
    }

    mockCards.push(newCard)
    return newCard
  },

  async updateSpendLimits(cardId: string, limits: Card["spendLimit"]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const card = mockCards.find((c) => c.id === cardId)
    if (card) {
      card.spendLimit = limits
    }
  },

  async toggleCardStatus(cardId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const card = mockCards.find((c) => c.id === cardId)
    if (card) {
      card.status = card.status === "active" ? "inactive" : "active"
    }
  },

  async getCardTransactions(cardId: string): Promise<CardTransaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockCardTransactions.filter((tx) => tx.cardId === cardId)
  },

  formatCardNumber(last4: string, brand: string): string {
    return `•••• •••• •••• ${last4}`
  },

  getCardBrandIcon(brand: string): string {
    const icons: Record<string, string> = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
    }
    return icons[brand] || "💳"
  },

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  },
}
