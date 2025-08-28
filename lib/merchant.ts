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

// Merchant service
export const merchantService = {
  async generateQR(request: MerchantQRRequest): Promise<GeneratedQR> {
    throw new Error("QR generation not implemented - connect to QR service API")
  },

  async getQRHistory(): Promise<GeneratedQR[]> {
    throw new Error("QR history not implemented - connect to merchant API")
  },

  formatQRData(request: MerchantQRRequest): string {
    return JSON.stringify(request, null, 2)
  },
}
