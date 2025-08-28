"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Send, Download, ArrowUpDown } from "lucide-react"
import { motion } from "framer-motion"

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
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={action.variant}
                className="h-auto flex-col gap-2 p-4 w-full transition-all duration-200 hover:shadow-md"
                onClick={action.onClick}
              >
                <motion.div whileHover={{ rotate: action.label === "Swap" ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <action.icon className="w-6 h-6" />
                </motion.div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
