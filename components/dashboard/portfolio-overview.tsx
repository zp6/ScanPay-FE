"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { walletService } from "@/lib/wallet"
import { TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface PortfolioOverviewProps {
  totalBalance: number
  isLoading: boolean
  onRefresh: () => void
}

export function PortfolioOverview({ totalBalance, isLoading, onRefresh }: PortfolioOverviewProps) {
  const [isHidden, setIsHidden] = useState(false)

  // Mock 24h change - in real app, calculate from historical data
  const change24h = 2.34
  const changeAmount = totalBalance * (change24h / 100)

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">Portfolio</CardTitle>
          <CardDescription>Your total crypto balance across all chains</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsHidden(!isHidden)}>
            {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4">
          <div className="text-4xl font-bold">{isHidden ? "••••••••" : walletService.formatUSD(totalBalance)}</div>
          {!isHidden && (
            <Badge variant={change24h >= 0 ? "default" : "destructive"} className="text-sm">
              {change24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {change24h >= 0 ? "+" : ""}
              {change24h.toFixed(2)}% ({change24h >= 0 ? "+" : ""}
              {walletService.formatUSD(changeAmount)})
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-2">
          {isHidden ? "Balance hidden for privacy" : "Last updated just now"}
        </p>
      </CardContent>
    </Card>
  )
}
