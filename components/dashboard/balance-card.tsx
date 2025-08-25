"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type WalletBalance, walletService } from "@/lib/wallet"
import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface BalanceCardProps {
  balance: WalletBalance
  isHidden?: boolean
  onToggleVisibility?: () => void
}

export function BalanceCard({ balance, isHidden = false, onToggleVisibility }: BalanceCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const chainLogo =
    balance.chainName === "Ethereum"
      ? "⟠"
      : balance.chainName === "Base"
        ? "🔵"
        : balance.chainName === "Polygon"
          ? "🟣"
          : balance.chainName === "Optimism"
            ? "🔴"
            : balance.chainName === "Arbitrum"
              ? "🔷"
              : "🔗"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="text-lg">{chainLogo}</span>
          {balance.chainName}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleVisibility}>
          {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isHidden ? "••••••" : walletService.formatUSD(balance.totalBalanceUSD)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {balance.tokens.length} token{balance.tokens.length !== 1 ? "s" : ""}
        </div>

        {showDetails && !isHidden && (
          <div className="mt-4 space-y-2">
            {balance.tokens.map((token) => (
              <div key={token.address} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{token.symbol}</span>
                  <Badge variant={token.change24h >= 0 ? "default" : "destructive"} className="text-xs">
                    {token.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(token.change24h).toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-medium">{walletService.formatBalance(token.balance, token.decimals)}</div>
                  <div className="text-muted-foreground">{walletService.formatUSD(token.balanceUSD)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>
      </CardContent>
    </Card>
  )
}
