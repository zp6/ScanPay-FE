"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, ArrowUpDown, Clock } from "lucide-react"
import { transactionService, type Transaction } from "@/lib/transactions"
import { useEffect, useState } from "react"

export function RecentActivity() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const result = await transactionService.getTransactions(1, 4)
        setTransactions(result.transactions)
      } catch (err) {
        setError("Failed to load transactions")
        console.error("Transaction fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case "swap":
        return <ArrowUpDown className="w-4 h-4 text-blue-500" />
      case "bridge":
        return <ArrowUpDown className="w-4 h-4 text-purple-500" />
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
            <Clock className="w-3 h-3 mr-1" />
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No transactions found</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <div className="font-medium text-sm capitalize">
                      {tx.type} {tx.amount} {tx.token}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tx.type === "send" && `To ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                      {tx.type === "receive" && `From ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}
                      {(tx.type === "swap" || tx.type === "bridge") && tx.chainName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(tx.status)}
                  <div className="text-xs text-muted-foreground mt-1">
                    {transactionService.formatTimeAgo(tx.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
