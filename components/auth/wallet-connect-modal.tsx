"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Wallet } from "lucide-react"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const wallets = [
  {
    name: "MetaMask",
    icon: "🦊",
    description: "Connect using MetaMask wallet",
    id: "metamask",
  },
  {
    name: "Phantom",
    icon: "👻",
    description: "Connect using Phantom wallet",
    id: "phantom",
  },
  {
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect using WalletConnect",
    id: "walletconnect",
  },
  {
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Connect using Coinbase Wallet",
    id: "coinbase",
  },
]

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const { connectWallet } = useAuth()
  const { toast } = useToast()

  const handleWalletConnect = async (walletId: string) => {
    setIsConnecting(walletId)
    try {
      throw new Error("Wallet connection not implemented - integrate with thirdweb SDK")
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>Choose your preferred wallet to connect to ScanPay</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-0"
                  onClick={() => handleWalletConnect(wallet.id)}
                  disabled={isConnecting !== null}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{wallet.name}</div>
                      <div className="text-sm text-muted-foreground">{wallet.description}</div>
                    </div>
                    {isConnecting === wallet.id && <Loader2 className="w-4 h-4 ml-auto animate-spin" />}
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
