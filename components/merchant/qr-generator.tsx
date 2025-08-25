"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { merchantService, type MerchantQRRequest, type GeneratedQR } from "@/lib/merchant"
import { QrCode, Copy, Download, Share, Loader2 } from "lucide-react"

export function QRGenerator() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQR, setGeneratedQR] = useState<GeneratedQR | null>(null)
  const [formData, setFormData] = useState<MerchantQRRequest>({
    amount: "",
    currency: "USDC",
    recipient: "",
    merchantName: "",
    memo: "",
    chainId: 1,
  })

  const handleGenerate = async () => {
    if (!formData.amount || !formData.recipient) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and recipient address",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const qr = await merchantService.generateQR(formData)
      setGeneratedQR(qr)
      toast({
        title: "QR Code Generated",
        description: "Your payment QR code is ready to use",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyQRData = () => {
    if (generatedQR) {
      navigator.clipboard.writeText(generatedQR.qrData)
      toast({
        title: "Copied",
        description: "QR data copied to clipboard",
      })
    }
  }

  const handleShare = () => {
    if (navigator.share && generatedQR) {
      navigator.share({
        title: "Payment QR Code",
        text: `Pay ${generatedQR.request.amount} ${generatedQR.request.currency}`,
        url: generatedQR.qrCodeUrl,
      })
    }
  }

  const handleReset = () => {
    setGeneratedQR(null)
    setFormData({
      amount: "",
      currency: "USDC",
      recipient: "",
      merchantName: "",
      memo: "",
      chainId: 1,
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Generate Payment QR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address *</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchantName">Merchant Name</Label>
            <Input
              id="merchantName"
              placeholder="Your business name"
              value={formData.merchantName}
              onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">Memo</Label>
            <Textarea
              id="memo"
              placeholder="Payment description..."
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chain">Blockchain</Label>
            <Select
              value={formData.chainId?.toString()}
              onValueChange={(value) => setFormData({ ...formData, chainId: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ethereum</SelectItem>
                <SelectItem value="8453">Base</SelectItem>
                <SelectItem value="10">Optimism</SelectItem>
                <SelectItem value="137">Polygon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR
                </>
              )}
            </Button>
            {generatedQR && (
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {generatedQR ? (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg border">
                  <img src={generatedQR.qrCodeUrl || "/placeholder.svg"} alt="Payment QR Code" className="w-48 h-48" />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {generatedQR.request.amount} {generatedQR.request.currency}
                  </div>
                  {generatedQR.request.merchantName && (
                    <div className="text-muted-foreground">{generatedQR.request.merchantName}</div>
                  )}
                </div>

                {generatedQR.request.memo && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <strong>Memo:</strong> {generatedQR.request.memo}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant={generatedQR.isActive ? "default" : "secondary"}>
                    {generatedQR.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Scanned:</span>
                  <span>{generatedQR.scannedCount} times</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyQRData}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <QrCode className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-center">Fill in the form and click "Generate QR" to create your payment QR code</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
