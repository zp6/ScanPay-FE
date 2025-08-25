"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { QRGenerator } from "@/components/merchant/qr-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { merchantService, type GeneratedQR } from "@/lib/merchant"
import { QrCode, History, TrendingUp, Users } from "lucide-react"

export default function MerchantPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [qrHistory, setQrHistory] = useState<GeneratedQR[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    loadQRHistory()
  }, [])

  const loadQRHistory = async () => {
    try {
      const history = await merchantService.getQRHistory()
      setQrHistory(history)
    } catch (error) {
      console.error("Failed to load QR history:", error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  if (!isAuthenticated) return null

  const totalScans = qrHistory.reduce((sum, qr) => sum + qr.scannedCount, 0)
  const activeQRs = qrHistory.filter((qr) => qr.isActive).length

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Merchant Tools</h1>
            <p className="text-muted-foreground">Create payment QR codes and manage your merchant account</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{qrHistory.length}</div>
                <p className="text-xs text-muted-foreground">{activeQRs} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalScans}</div>
                <p className="text-xs text-muted-foreground">Across all QR codes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(totalScans * 0.7)}</div>
                <p className="text-xs text-muted-foreground">Estimated unique payers</p>
              </CardContent>
            </Card>
          </div>

          {/* QR Generator */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Generate Payment QR</h2>
            <QRGenerator />
          </div>

          {/* QR History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Recent QR Codes</h2>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {isLoadingHistory ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg" />
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : qrHistory.length > 0 ? (
                qrHistory.map((qr) => (
                  <Card key={qr.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-muted-foreground" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {qr.request.amount} {qr.request.currency}
                            </span>
                            <Badge variant={qr.isActive ? "default" : "secondary"}>
                              {qr.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {qr.request.merchantName && <div>{qr.request.merchantName}</div>}
                            {qr.request.memo && <div>{qr.request.memo}</div>}
                            <div>
                              Created{" "}
                              {merchantService.formatTimeAgo
                                ? new Date(qr.createdAt).toLocaleDateString()
                                : qr.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">{qr.scannedCount} scans</div>
                          <div className="text-sm text-muted-foreground">
                            {qr.request.recipient.slice(0, 6)}...{qr.request.recipient.slice(-4)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <QrCode className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No QR Codes Yet</h3>
                    <p className="text-muted-foreground text-center">
                      Create your first payment QR code to start accepting crypto payments
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
