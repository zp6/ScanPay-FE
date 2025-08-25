"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionList } from "@/components/transactions/transaction-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { transactionService, type TransactionFilter, type PaginatedTransactions } from "@/lib/transactions"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"

export default function TransactionsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<PaginatedTransactions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<TransactionFilter>({})
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    loadTransactions()
  }, [filter, currentPage])

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      const result = await transactionService.getTransactions(currentPage, 10, filter)
      setTransactions(result)
    } catch (error) {
      console.error("Failed to load transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (newFilter: TransactionFilter) => {
    setFilter(newFilter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleClearFilters = () => {
    setFilter({})
    setCurrentPage(1)
  }

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/PDF
    console.log("Exporting transactions...")
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Transaction History</h1>
              <p className="text-muted-foreground">View and manage your transaction history</p>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Filters */}
          <TransactionFilters filter={filter} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />

          {/* Transaction List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transactions</span>
                {transactions && (
                  <span className="text-sm font-normal text-muted-foreground">{transactions.totalCount} total</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions?.transactions || []} isLoading={isLoading} />

              {/* Pagination */}
              {transactions && transactions.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Page {transactions.currentPage} of {transactions.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!transactions.hasPreviousPage || isLoading}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!transactions.hasNextPage || isLoading}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
