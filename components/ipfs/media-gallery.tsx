"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Filter } from "lucide-react"
import type { IPFSMediaItem } from "@/types/ipfs"
import { FilePreview } from "./file-preview"
import { cn } from "@/lib/utils"

interface MediaGalleryProps {
  files: IPFSMediaItem[]
  className?: string
  onFileSelect?: (file: IPFSMediaItem) => void
  selectable?: boolean
}

export function MediaGallery({ files, className, onFileSelect, selectable = false }: MediaGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch =
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.hash.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === "all" || file.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [files, searchQuery, typeFilter])

  const fileTypes = useMemo(() => {
    const types = new Set(files.map((file) => file.type))
    return Array.from(types)
  }, [files])

  const totalSize = useMemo(() => {
    return files.reduce((acc, file) => acc + file.size, 0)
  }, [files])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileClick = (file: IPFSMediaItem) => {
    if (selectable) {
      const newSelected = new Set(selectedFiles)
      if (newSelected.has(file.id)) {
        newSelected.delete(file.id)
      } else {
        newSelected.add(file.id)
      }
      setSelectedFiles(newSelected)
    }
    onFileSelect?.(file)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>IPFS Media Gallery</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {files.length} files • {formatFileSize(totalSize)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files or IPFS hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {fileTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Files Info */}
        {selectable && selectedFiles.size > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedFiles.size} selected</Badge>
            <Button variant="outline" size="sm" onClick={() => setSelectedFiles(new Set())}>
              Clear Selection
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Upload some files to get started"}
            </p>
          </div>
        ) : (
          <div
            className={cn(viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4")}
          >
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "cursor-pointer transition-all",
                  selectable && selectedFiles.has(file.id) && "ring-2 ring-primary",
                  selectable && "hover:ring-1 hover:ring-primary/50",
                )}
                onClick={() => handleFileClick(file)}
              >
                <FilePreview
                  file={file}
                  showActions={!selectable}
                  className={cn(viewMode === "list" && "flex-row", selectable && "hover:shadow-md")}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
