"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Share, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReceivePage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, isLoading, router])

  const walletAddress = user?.walletAddress || "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c"

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My ScanPay Wallet",
        text: `Send crypto to my wallet: ${walletAddress}`,
      })
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Receive Crypto</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Your Wallet Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Address</span>
                  <Badge variant="secondary">Ethereum</Badge>
                </div>
                <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">{walletAddress}</div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleCopyAddress}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Share this address to receive payments on Ethereum and compatible networks
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
