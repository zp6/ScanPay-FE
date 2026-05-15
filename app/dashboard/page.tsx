"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useWallet } from "@/hooks/use-wallet"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { IPFSSection } from "@/components/dashboard/ipfs-section"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FadeIn } from "@/components/ui/fade-in"
import { SlideUp } from "@/components/ui/slide-up"

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { balances, totalBalanceUSD, isLoading: walletLoading, refreshBalances } = useWallet()
  const router = useRouter()
  const [hiddenChains, setHiddenChains] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, authLoading, router])

  const toggleChainVisibility = (chainId: number) => {
    const newHidden = new Set(hiddenChains)
    if (newHidden.has(chainId)) {
      newHidden.delete(chainId)
    } else {
      newHidden.add(chainId)
    }
    setHiddenChains(newHidden)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "scan":
        router.push("/scan")
        break
      case "send":
        router.push("/send")
        break
      case "receive":
        router.push("/receive")
        break
      case "swap":
        router.push("/swap")
        break
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 col-span-full" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <FadeIn>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SlideUp delay={0.1}>
              <PortfolioOverview totalBalance={totalBalanceUSD} isLoading={walletLoading} onRefresh={refreshBalances} />
            </SlideUp>

            {walletLoading ? (
              <>
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </>
            ) : (
              balances.map((balance, index) => (
                <SlideUp key={balance.chainId} delay={0.2 + index * 0.1}>
                  <BalanceCard
                    balance={balance}
                    isHidden={hiddenChains.has(balance.chainId)}
                    onToggleVisibility={() => toggleChainVisibility(balance.chainId)}
                  />
                </SlideUp>
              ))
            )}

            <SlideUp delay={0.4}>
              <QuickActions
                onScanQR={() => handleQuickAction("scan")}
                onSend={() => handleQuickAction("send")}
                onReceive={() => handleQuickAction("receive")}
                onSwap={() => handleQuickAction("swap")}
              />
            </SlideUp>

            <SlideUp delay={0.5}>
              <RecentActivity />
            </SlideUp>

            <SlideUp delay={0.6}>
              <div className="col-span-full">
                <IPFSSection />
              </div>
            </SlideUp>

            {!walletLoading && balances.length === 0 && (
              <SlideUp delay={0.3}>
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-semibold">No wallet connected</h3>
                      <p className="text-muted-foreground">
                        Connect a wallet to view your balances and start making payments
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>
            )}
          </div>
        </FadeIn>
      </main>
    </div>
  )
}
