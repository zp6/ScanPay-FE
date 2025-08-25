// Merchant tools and QR generation utilities for ScanPay
export interface MerchantQRRequest {
  amount: string
  currency: string
  recipient: string
  merchantName?: string
  merchantLogo?: string
  memo?: string
  chainId?: number
  expiresAt?: Date
}

export interface GeneratedQR {
  id: string
  qrData: string
  qrCodeUrl: string
  request: MerchantQRRequest
  createdAt: Date
  scannedCount: number
  isActive: boolean
}

// Mock merchant service
export const merchantService = {
  async generateQR(request: MerchantQRRequest): Promise<GeneratedQR> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const qrData = JSON.stringify({
      recipient: request.recipient,
      amount: request.amount,
      currency: request.currency,
      chainId: request.chainId || 1,
      merchantName: request.merchantName,
      memo: request.memo,
      timestamp: Date.now(),
    })

    // In a real app, this would generate an actual QR code image
    const qrCodeUrl = `/placeholder.svg?height=200&width=200&query=QR code for ${request.amount} ${request.currency}`

    return {
      id: Math.random().toString(36).substr(2, 9),
      qrData,
      qrCodeUrl,
      request,
      createdAt: new Date(),
      scannedCount: 0,
      isActive: true,
    }
  },

  async getQRHistory(): Promise<GeneratedQR[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock QR history
    return [
      {
        id: "qr1",
        qrData: JSON.stringify({ amount: "25.00", currency: "USDC", recipient: "0x123..." }),
        qrCodeUrl: "/qr-code-for-25-usdc.png",
        request: {
          amount: "25.00",
          currency: "USDC",
          recipient: "0x123a456b789c012d345e678f901a234b567c890d",
          merchantName: "Coffee Shop",
          memo: "Latte + Pastry",
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        scannedCount: 3,
        isActive: true,
      },
      {
        id: "qr2",
        qrData: JSON.stringify({ amount: "0.05", currency: "ETH", recipient: "0x456..." }),
        qrCodeUrl: "/qr-code-for-0-05-eth.png",
        request: {
          amount: "0.05",
          currency: "ETH",
          recipient: "0x456b789c012d345e678f901a234b567c890d123a",
          merchantName: "Tech Store",
          memo: "USB Cable",
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        scannedCount: 1,
        isActive: false,
      },
    ]
  },

  formatQRData(request: MerchantQRRequest): string {
    return JSON.stringify(request, null, 2)
  },
}
