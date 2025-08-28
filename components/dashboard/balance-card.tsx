"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type WalletBalance, walletService } from "@/lib/wallet"
import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <motion.span className="text-lg" whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
              {chainLogo}
            </motion.span>
            {balance.chainName}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-primary/10 transition-colors"
            onClick={onToggleVisibility}
          >
            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.1 }}>
              {isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </motion.div>
          </Button>
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold"
            key={isHidden ? "hidden" : "visible"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isHidden ? "••••••" : walletService.formatUSD(balance.totalBalanceUSD)}
          </motion.div>
          <div className="text-xs text-muted-foreground mt-1">
            {balance.tokens.length} token{balance.tokens.length !== 1 ? "s" : ""}
          </div>

          <AnimatePresence>
            {showDetails && !isHidden && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-4 space-y-2 overflow-hidden"
              >
                {balance.tokens.map((token, index) => (
                  <motion.div
                    key={token.address}
                    className="flex items-center justify-between text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
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
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 hover:bg-primary/10 transition-colors"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
