"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Wallet, Zap, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  const handleGetStarted = () => {
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            Web3 Payment Revolution
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            One-Tap Crypto
            <span className="text-primary block">Payments</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Scan, pay, done. ScanPay makes crypto payments as simple as scanning a QR code with advanced routing and
            account abstraction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose ScanPay?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for the future of payments with cutting-edge Web3 technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <QrCode className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Instant QR Scanning</CardTitle>
              <CardDescription>Point, scan, and pay in seconds with our advanced QR code technology</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Wallet className="w-12 h-12 text-accent mb-4" />
              <CardTitle>Multi-Chain Support</CardTitle>
              <CardDescription>
                Connect wallets across Ethereum, Solana, Base, and more with unified balances
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Account Abstraction</CardTitle>
              <CardDescription>No gas fees, no complex approvals. Just seamless one-tap transactions</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to revolutionize payments?</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users already experiencing the future of crypto payments
            </p>
            <Button size="lg" className="text-lg px-12" onClick={handleGetStarted}>
              Start Paying with ScanPay
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
