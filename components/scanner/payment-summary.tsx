"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type PaymentSummary as PaymentSummaryType, aiRoutingService } from "@/lib/qr-scanner"
import { walletService } from "@/lib/wallet"
import { Loader2, Zap, Clock, DollarSign, ArrowRight, CheckCircle, XCircle } from "lucide-react"

interface PaymentSummaryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: PaymentSummaryType | null
  onConfirm: () => void
}

export function PaymentSummaryComponent({ open, onOpenChange, summary, onConfirm }: PaymentSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; txHash?: string; error?: string } | null>(null)

  if (!summary) return null

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    try {
      const result = await aiRoutingService.processPayment(summary)
      setPaymentResult(result)
      if (result.success) {
        setTimeout(() => {
          onConfirm()
          onOpenChange(false)
        }, 2000)
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        error: "Payment processing failed",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Payment result screen
  if (paymentResult) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            {paymentResult.success ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground mb-4">Your payment has been processed successfully</p>
                {paymentResult.txHash && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                    <p className="text-sm font-mono break-all">{paymentResult.txHash}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
                <p className="text-muted-foreground mb-4">{paymentResult.error || "Something went wrong"}</p>
                <Button onClick={() => setPaymentResult(null)} variant="outline">
                  Try Again
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Payment Summary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Merchant Info */}
          {summary.merchantName && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={summary.merchantLogo || "/placeholder.svg"} />
                    <AvatarFallback>{summary.merchantName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{summary.merchantName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {summary.recipient.slice(0, 6)}...{summary.recipient.slice(-4)}
                    </p>
                  </div>
                </div>
                {summary.memo && (
                  <p className="text-sm text-muted-foreground mt-3 p-2 bg-muted rounded">{summary.memo}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Amount */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {summary.amount} {summary.currency}
              </div>
              <div className="text-muted-foreground">≈ {walletService.formatUSD(summary.totalCostUSD)}</div>
            </CardContent>
          </Card>

          {/* AI Routing Suggestion */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                AI-Optimized Route
                <Badge variant="secondary" className="ml-auto">
                  {Math.round(summary.routingSuggestion.confidence * 100)}% confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="font-semibold">{summary.routingSuggestion.fromToken}</div>
                  <div className="text-sm text-muted-foreground">{summary.routingSuggestion.fromChain}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="text-center">
                  <div className="font-semibold">{summary.routingSuggestion.toToken}</div>
                  <div className="text-sm text-muted-foreground">{summary.routingSuggestion.toChain}</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">{summary.routingSuggestion.savings}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Savings</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{summary.routingSuggestion.estimatedTime}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Est. Time</div>
                </div>
                <div>
                  <div className="font-semibold">{summary.routingSuggestion.estimatedGas}</div>
                  <div className="text-xs text-muted-foreground">Gas Fee</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Cost */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Cost</span>
                <div className="text-right">
                  <div className="font-bold text-lg">{summary.totalCost}</div>
                  <div className="text-sm text-muted-foreground">{walletService.formatUSD(summary.totalCostUSD)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment} disabled={isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { PaymentSummaryComponent as PaymentSummary }
