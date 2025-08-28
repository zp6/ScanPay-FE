"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Wallet, Zap, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/fade-in"
import { SlideUp } from "@/components/ui/slide-up"

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

  const features = [
    {
      icon: QrCode,
      title: "Instant QR Scanning",
      description: "Point, scan, and pay in seconds with our advanced QR code technology",
      color: "text-primary",
    },
    {
      icon: Wallet,
      title: "Multi-Chain Support",
      description: "Connect wallets across Ethereum, Solana, Base, and more with unified balances",
      color: "text-accent",
    },
    {
      icon: Shield,
      title: "Account Abstraction",
      description: "No gas fees, no complex approvals. Just seamless one-tap transactions",
      color: "text-primary",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Zap className="w-4 h-4" />
              </motion.div>
              Web3 Payment Revolution
            </div>
          </FadeIn>

          <SlideUp delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              One-Tap Crypto
              <motion.span
                className="text-primary block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Payments
              </motion.span>
            </h1>
          </SlideUp>

          <SlideUp delay={0.4}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Scan, pay, done. ScanPay makes crypto payments as simple as scanning a QR code with advanced routing and
              account abstraction.
            </p>
          </SlideUp>

          <SlideUp delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                <Button
                  size="lg"
                  className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent hover:bg-primary/5 transition-colors"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </SlideUp>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <SlideUp delay={0.8}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose ScanPay?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for the future of payments with cutting-edge Web3 technology
            </p>
          </div>
        </SlideUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                    <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  </motion.div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <SlideUp delay={1.8}>
        <div className="container mx-auto px-4 py-16">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:shadow-xl transition-shadow">
              <CardContent className="p-12 text-center">
                <h3 className="text-3xl font-bold mb-4">Ready to revolutionize payments?</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of users already experiencing the future of crypto payments
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                  <Button
                    size="lg"
                    className="text-lg px-12 shadow-lg hover:shadow-xl transition-shadow"
                    onClick={handleGetStarted}
                  >
                    Start Paying with ScanPay
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SlideUp>
    </div>
  )
}
