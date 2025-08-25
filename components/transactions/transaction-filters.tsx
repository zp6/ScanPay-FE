"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { TransactionFilter } from "@/lib/transactions"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"

interface TransactionFiltersProps {
  filter: TransactionFilter
  onFilterChange: (filter: TransactionFilter) => void
  onClearFilters: () => void
}

export function TransactionFilters({ filter, onFilterChange, onClearFilters }: TransactionFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = Object.values(filter).filter(Boolean).length

  const handleFilterChange = (key: keyof TransactionFilter, value: any) => {
    onFilterChange({ ...filter, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      {showFilters && (
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by hash, token, or memo..."
              value={filter.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value || undefined)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={filter.type || "all"}
                onValueChange={(value) => handleFilterChange("type", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="send">Send</SelectItem>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                  <SelectItem value="bridge">Bridge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filter.status || "all"}
                onValueChange={(value) => handleFilterChange("status", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chain Filter */}
            <div className="space-y-2">
              <Label>Chain</Label>
              <Select
                value={filter.chainId?.toString() || "all"}
                onValueChange={(value) => handleFilterChange("chainId", value ? Number.parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All chains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All chains</SelectItem>
                  <SelectItem value="1">Ethereum</SelectItem>
                  <SelectItem value="8453">Base</SelectItem>
                  <SelectItem value="10">Optimism</SelectItem>
                  <SelectItem value="137">Polygon</SelectItem>
                  <SelectItem value="42161">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {filter.dateFrom ? format(filter.dateFrom, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filter.dateFrom}
                      onSelect={(date) => handleFilterChange("dateFrom", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {filter.dateTo ? format(filter.dateTo, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filter.dateTo}
                      onSelect={(date) => handleFilterChange("dateTo", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
