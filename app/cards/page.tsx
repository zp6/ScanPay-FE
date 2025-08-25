"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { CardList } from "@/components/cards/card-list"
import { AddCardModal } from "@/components/cards/add-card-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cardService, type Card as CardType } from "@/lib/cards"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, DollarSign, TrendingUp, Calendar, Save } from "lucide-react"

export default function CardsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const [spendLimits, setSpendLimits] = useState({
    daily: 0,
    monthly: 0,
    perTransaction: 0,
  })
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, authLoading, router])

  const handleCardAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleCardSettings = (card: CardType) => {
    setSelectedCard(card)
    setSpendLimits(card.spendLimit)
  }

  const handleSaveSettings = async () => {
    if (!selectedCard) return

    try {
      await cardService.updateSpendLimits(selectedCard.id, spendLimits)
      toast({
        title: "Settings Updated",
        description: "Card spend limits have been updated successfully",
      })
      setSelectedCard(null)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update card settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Cards</h1>
              <p className="text-muted-foreground">Manage your virtual and physical cards</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">1 active, 1 pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,500.75</div>
                <p className="text-xs text-muted-foreground">Across all cards</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$342.49</div>
                <p className="text-xs text-muted-foreground">Total spent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Card List */}
          <CardList key={refreshTrigger} onAddCard={() => setShowAddModal(true)} onCardSettings={handleCardSettings} />
        </div>
      </main>

      {/* Add Card Modal */}
      <AddCardModal open={showAddModal} onOpenChange={setShowAddModal} onCardAdded={handleCardAdded} />

      {/* Card Settings Modal */}
      <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Card Settings</DialogTitle>
          </DialogHeader>

          {selectedCard && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold">{selectedCard.nickname || "ScanPay Card"}</h3>
                <p className="text-sm text-muted-foreground">
                  {cardService.formatCardNumber(selectedCard.last4, selectedCard.brand)}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Spend Limits</h4>

                <div className="space-y-2">
                  <Label htmlFor="daily">Daily Limit</Label>
                  <Input
                    id="daily"
                    type="number"
                    value={spendLimits.daily}
                    onChange={(e) => setSpendLimits({ ...spendLimits, daily: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly">Monthly Limit</Label>
                  <Input
                    id="monthly"
                    type="number"
                    value={spendLimits.monthly}
                    onChange={(e) =>
                      setSpendLimits({ ...spendLimits, monthly: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perTransaction">Per Transaction Limit</Label>
                  <Input
                    id="perTransaction"
                    type="number"
                    value={spendLimits.perTransaction}
                    onChange={(e) =>
                      setSpendLimits({ ...spendLimits, perTransaction: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedCard(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
