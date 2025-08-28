"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useWallet } from "@/hooks/use-wallet"
import { QRScanner } from "@/components/scanner/qr-scanner"
import { PaymentSummary } from "@/components/scanner/payment-summary"
import {
  qrService,
  aiRoutingService,
  type PaymentRequest,
  type PaymentSummary as PaymentSummaryType,
} from "@/lib/qr-scanner"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ScanPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { balances } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  const [showScanner, setShowScanner] = useState(true)
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryType | null>(null)
  const [isProcessingQR, setIsProcessingQR] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, authLoading, router])

  const handleScanResult = async (qrData: string) => {
    setIsProcessingQR(true)
    setShowScanner(false)

    try {
      // Parse QR code
      const request = qrService.parseQRCode(qrData)
      if (!request) {
        throw new Error("Invalid QR code format")
      }

      setPaymentRequest(request)

      // Get AI routing suggestion
      const routingSuggestion = await aiRoutingService.getSuggestion(request, balances)

      // Calculate total cost (amount + gas fees)
      const totalCostUSD = Number.parseFloat(request.amount) * 2000 + 5.5 // Mock calculation

      const summary: PaymentSummaryType = {
        ...request,
        routingSuggestion,
        totalCost: `${request.amount} ${request.currency} + ${routingSuggestion.estimatedGas}`,
        totalCostUSD,
      }

      setPaymentSummary(summary)

      toast({
        title: "QR Code Scanned",
        description: `Payment request for ${request.amount} ${request.currency}`,
      })
    } catch (error) {
      toast({
        title: "Scan Error",
        description: "Failed to process QR code. Please try again.",
        variant: "destructive",
      })
      setShowScanner(true)
    } finally {
      setIsProcessingQR(false)
    }
  }

  const handlePaymentConfirm = () => {
    toast({
      title: "Payment Completed",
      description: "Your payment has been processed successfully!",
    })
    router.push("/dashboard")
  }

  const handleCloseScanner = () => {
    router.push("/dashboard")
  }

  const handleCloseSummary = (open: boolean) => {
    if (!open) {
      setPaymentSummary(null)
      setPaymentRequest(null)
      setShowScanner(true)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="w-8 h-8 animate-spin" />
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QRScanner onScanResult={handleScanResult} onClose={handleCloseScanner} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProcessingQR && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-background p-6 rounded-lg text-center shadow-xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Loader2 className="w-8 h-8 mx-auto mb-4 text-primary" />
              </motion.div>
              <motion.p
                className="text-lg font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Processing QR Code...
              </motion.p>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Getting AI routing suggestions
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentSummary
        open={!!paymentSummary}
        onOpenChange={handleCloseSummary}
        summary={paymentSummary}
        onConfirm={handlePaymentConfirm}
      />
    </>
  )
}
