"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Transaction, transactionService } from "@/lib/transactions"
import { walletService } from "@/lib/wallet"
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpDown,
  Badge as Bridge,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case "swap":
        return <ArrowUpDown className="w-4 h-4 text-blue-500" />
      case "bridge":
        return <Bridge className="w-4 h-4 text-purple-500" />
    }
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="text-xs">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="text-xs">
            Failed
          </Badge>
        )
    }
  }

  const getChainBadge = (chainName: string) => {
    const chainColors: Record<string, string> = {
      Ethereum: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Base: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Optimism: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Polygon: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Arbitrum: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    }

    return (
      <Badge variant="outline" className={`text-xs ${chainColors[chainName] || ""}`}>
        {chainName}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-muted rounded w-20 mb-2" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground">
            <ArrowUpDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
            <p>Try adjusting your filters or make your first transaction</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Transaction Icon & Status */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="absolute -bottom-1 -right-1">{getStatusIcon(transaction.status)}</div>
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold capitalize">{transaction.type}</span>
                  {getStatusBadge(transaction.status)}
                  {getChainBadge(transaction.chainName)}
                </div>

                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <span>
                      {transaction.amount} {transaction.token}
                    </span>
                    <span>•</span>
                    <span>{transactionService.formatTimeAgo(transaction.timestamp)}</span>
                  </div>

                  {transaction.merchantName && (
                    <div className="flex items-center gap-1">
                      <span>To: {transaction.merchantName}</span>
                      {transaction.memo && <span>• {transaction.memo}</span>}
                    </div>
                  )}

                  {!transaction.merchantName && (
                    <div className="font-mono text-xs">
                      {transaction.type === "send" ? "To: " : "From: "}
                      {transaction.type === "send"
                        ? `${transaction.to.slice(0, 6)}...${transaction.to.slice(-4)}`
                        : `${transaction.from.slice(0, 6)}...${transaction.from.slice(-4)}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="text-right">
                <div className="font-semibold">
                  {transaction.type === "receive" ? "+" : transaction.type === "send" ? "-" : ""}
                  {transaction.amount} {transaction.token}
                </div>
                <div className="text-sm text-muted-foreground">{walletService.formatUSD(transaction.usdValue)}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-6 px-2"
                  onClick={() =>
                    window.open(transactionService.getExplorerUrl(transaction.chainId, transaction.hash), "_blank")
                  }
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
