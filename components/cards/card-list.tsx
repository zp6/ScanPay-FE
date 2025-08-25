"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cardService, type Card as CardType } from "@/lib/cards"
import { CreditCard, Plus, Settings, Eye, EyeOff } from "lucide-react"

interface CardListProps {
  onAddCard: () => void
  onCardSettings: (card: CardType) => void
}

export function CardList({ onAddCard, onCardSettings }: CardListProps) {
  const [cards, setCards] = useState<CardType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const cardData = await cardService.getCards()
      setCards(cardData)
    } catch (error) {
      console.error("Failed to load cards:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleCard = async (cardId: string) => {
    try {
      await cardService.toggleCardStatus(cardId)
      setCards(
        cards.map((card) =>
          card.id === cardId ? { ...card, status: card.status === "active" ? "inactive" : "active" } : card,
        ),
      )
    } catch (error) {
      console.error("Failed to toggle card:", error)
    }
  }

  const toggleCardVisibility = (cardId: string) => {
    const newHidden = new Set(hiddenCards)
    if (newHidden.has(cardId)) {
      newHidden.delete(cardId)
    } else {
      newHidden.add(cardId)
    }
    setHiddenCards(newHidden)
  }

  const getStatusBadge = (status: CardType["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getCardGradient = (brand: string, type: string) => {
    if (type === "virtual") {
      return "bg-gradient-to-br from-primary to-accent"
    }
    return brand === "visa"
      ? "bg-gradient-to-br from-blue-600 to-blue-800"
      : "bg-gradient-to-br from-red-600 to-red-800"
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add Card Button */}
      <Card
        className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={onAddCard}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Plus className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Add New Card</h3>
          <p className="text-sm text-muted-foreground text-center">
            Create a virtual card instantly or order a physical card
          </p>
        </CardContent>
      </Card>

      {/* Cards */}
      {cards.map((card) => (
        <Card key={card.id} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Card Visual */}
            <div className={`${getCardGradient(card.brand, card.type)} text-white p-6 relative`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-sm opacity-80 mb-1">
                    {card.type === "virtual" ? "Virtual Card" : "Physical Card"}
                  </div>
                  <div className="font-semibold">{card.nickname || "ScanPay Card"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={() => toggleCardVisibility(card.id)}
                  >
                    {hiddenCards.has(card.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  {getStatusBadge(card.status)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xl font-mono tracking-wider">
                  {hiddenCards.has(card.id)
                    ? "•••• •••• •••• ••••"
                    : cardService.formatCardNumber(card.last4, card.brand)}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-80">EXPIRES</div>
                    <div className="font-mono">
                      {hiddenCards.has(card.id)
                        ? "••/••"
                        : `${card.expiryMonth.toString().padStart(2, "0")}/${card.expiryYear.toString().slice(-2)}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80">BALANCE</div>
                    <div className="font-semibold">
                      {hiddenCards.has(card.id) ? "••••••" : cardService.formatCurrency(card.balance)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Brand Icon */}
              <div className="absolute top-6 right-6 text-2xl">{cardService.getCardBrandIcon(card.brand)}</div>
            </div>

            {/* Card Controls */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Card Status</div>
                  <div className="text-sm text-muted-foreground">
                    {card.status === "active" ? "Card is active and ready to use" : "Card is currently disabled"}
                  </div>
                </div>
                <Switch
                  checked={card.status === "active"}
                  onCheckedChange={() => handleToggleCard(card.id)}
                  disabled={card.status === "pending" || card.status === "blocked"}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Daily Limit</div>
                  <div className="font-medium">{cardService.formatCurrency(card.spendLimit.daily)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Monthly Limit</div>
                  <div className="font-medium">{cardService.formatCurrency(card.spendLimit.monthly)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Per Transaction</div>
                  <div className="font-medium">{cardService.formatCurrency(card.spendLimit.perTransaction)}</div>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" onClick={() => onCardSettings(card)}>
                <Settings className="w-4 h-4 mr-2" />
                Card Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {cards.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Cards Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first virtual card to start spending your crypto anywhere
            </p>
            <Button onClick={onAddCard}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
