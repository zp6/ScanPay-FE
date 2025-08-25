"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Send, Download, ArrowUpDown } from "lucide-react"

interface QuickActionsProps {
  onScanQR: () => void
  onSend: () => void
  onReceive: () => void
  onSwap: () => void
}

export function QuickActions({ onScanQR, onSend, onReceive, onSwap }: QuickActionsProps) {
  const actions = [
    {
      icon: QrCode,
      label: "Scan & Pay",
      description: "Scan QR to pay",
      onClick: onScanQR,
      variant: "default" as const,
    },
    {
      icon: Send,
      label: "Send",
      description: "Send crypto",
      onClick: onSend,
      variant: "outline" as const,
    },
    {
      icon: Download,
      label: "Receive",
      description: "Get crypto",
      onClick: onReceive,
      variant: "outline" as const,
    },
    {
      icon: ArrowUpDown,
      label: "Swap",
      description: "Exchange tokens",
      onClick: onSwap,
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto flex-col gap-2 p-4"
              onClick={action.onClick}
            >
              <action.icon className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
