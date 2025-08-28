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

// Card service
export const cardService = {
  async getCards(): Promise<Card[]> {
    throw new Error("Card service not implemented - connect to real API")
  },

  async createCard(type: "virtual" | "physical", nickname?: string): Promise<Card> {
    throw new Error("Card creation not implemented - connect to real API")
  },

  async updateSpendLimits(cardId: string, limits: Card["spendLimit"]): Promise<void> {
    throw new Error("Spend limit update not implemented - connect to real API")
  },

  async toggleCardStatus(cardId: string): Promise<void> {
    throw new Error("Card status toggle not implemented - connect to real API")
  },

  async getCardTransactions(cardId: string): Promise<CardTransaction[]> {
    throw new Error("Card transactions not implemented - connect to real API")
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
