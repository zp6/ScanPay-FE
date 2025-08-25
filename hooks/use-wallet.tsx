"use client"

import { useState, useEffect } from "react"
import { type WalletBalance, walletService } from "@/lib/wallet"
import { useAuth } from "./use-auth"

export function useWallet() {
  const { user, isAuthenticated } = useAuth()
  const [balances, setBalances] = useState<WalletBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalBalanceUSD = balances.reduce((sum, chain) => sum + chain.totalBalanceUSD, 0)

  const refreshBalances = async () => {
    if (!isAuthenticated || !user?.walletAddress) return

    setIsLoading(true)
    setError(null)

    try {
      const walletBalances = await walletService.getBalances(user.walletAddress)
      setBalances(walletBalances)
    } catch (err) {
      setError("Failed to fetch wallet balances")
      console.error("Wallet balance error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshBalances()
  }, [isAuthenticated, user?.walletAddress])

  return {
    balances,
    totalBalanceUSD,
    isLoading,
    error,
    refreshBalances,
  }
}
