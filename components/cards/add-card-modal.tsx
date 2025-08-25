"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cardService } from "@/lib/cards"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Smartphone, Loader2, Zap, Truck } from "lucide-react"

interface AddCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCardAdded: () => void
}

export function AddCardModal({ open, onOpenChange, onCardAdded }: AddCardModalProps) {
  const { toast } = useToast()
  const [selectedType, setSelectedType] = useState<"virtual" | "physical" | null>(null)
  const [nickname, setNickname] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateCard = async () => {
    if (!selectedType) return

    setIsCreating(true)
    try {
      await cardService.createCard(selectedType, nickname || undefined)
      toast({
        title: "Card Created",
        description: `Your ${selectedType} card has been ${selectedType === "virtual" ? "created" : "ordered"} successfully`,
      })
      onCardAdded()
      onOpenChange(false)
      setSelectedType(null)
      setNickname("")
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const cardTypes = [
    {
      type: "virtual" as const,
      title: "Virtual Card",
      description: "Instant digital card for online purchases",
      icon: Smartphone,
      features: ["Instant activation", "Online purchases", "Subscription management", "Enhanced security"],
      badge: "Instant",
      badgeVariant: "default" as const,
    },
    {
      type: "physical" as const,
      title: "Physical Card",
      description: "Premium metal card for in-person payments",
      icon: CreditCard,
      features: ["Premium metal design", "Contactless payments", "ATM withdrawals", "Global acceptance"],
      badge: "5-7 days",
      badgeVariant: "secondary" as const,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add New Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedType ? (
            <>
              <p className="text-muted-foreground">Choose the type of card you'd like to create</p>

              <div className="grid gap-4">
                {cardTypes.map((cardType) => (
                  <Card
                    key={cardType.type}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedType(cardType.type)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <cardType.icon className="w-6 h-6 text-primary" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{cardType.title}</h3>
                            <Badge variant={cardType.badgeVariant}>
                              {cardType.type === "virtual" ? (
                                <Zap className="w-3 h-3 mr-1" />
                              ) : (
                                <Truck className="w-3 h-3 mr-1" />
                              )}
                              {cardType.badge}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-3">{cardType.description}</p>

                          <div className="grid grid-cols-2 gap-2">
                            {cardType.features.map((feature) => (
                              <div key={feature} className="text-sm text-muted-foreground flex items-center gap-1">
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)}>
                  ← Back
                </Button>
                <div>
                  <h3 className="font-semibold">{cardTypes.find((t) => t.type === selectedType)?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cardTypes.find((t) => t.type === selectedType)?.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Card Nickname (Optional)</Label>
                  <Input
                    id="nickname"
                    placeholder="e.g., Shopping Card, Travel Card"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Give your card a memorable name to easily identify it</p>
                </div>

                {selectedType === "physical" && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Physical Card Delivery</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your premium metal card will be shipped to your registered address within 5-7 business days.
                      Standard shipping is free.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedType(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCard} disabled={isCreating} className="flex-1">
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        {selectedType === "virtual" ? "Create Card" : "Order Card"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
