"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, ArrowUpDown, Clock } from "lucide-react"

interface Transaction {
  id: string
  type: "send" | "receive" | "swap"
  amount: string
  token: string
  to?: string
  from?: string
  timestamp: Date
  status: "completed" | "pending" | "failed"
  hash: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: "0.5",
    token: "ETH",
    from: "0x742d...5b8c",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    status: "completed",
    hash: "0xabc123...",
  },
  {
    id: "2",
    type: "send",
    amount: "100",
    token: "USDC",
    to: "0x123a...9def",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "completed",
    hash: "0xdef456...",
  },
  {
    id: "3",
    type: "swap",
    amount: "250",
    token: "USDC → ETH",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: "completed",
    hash: "0x789ghi...",
  },
  {
    id: "4",
    type: "send",
    amount: "50",
    token: "MATIC",
    to: "0x456b...1abc",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    status: "pending",
    hash: "0x321jkl...",
  },
]

export function RecentActivity() {
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case "swap":
        return <ArrowUpDown className="w-4 h-4 text-blue-500" />
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
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
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTransactionIcon(tx.type)}
                <div>
                  <div className="font-medium text-sm capitalize">
                    {tx.type} {tx.amount} {tx.token}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tx.to && `To ${tx.to}`}
                    {tx.from && `From ${tx.from}`}
                    {!tx.to && !tx.from && "Token swap"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(tx.status)}
                <div className="text-xs text-muted-foreground mt-1">{formatTimeAgo(tx.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
