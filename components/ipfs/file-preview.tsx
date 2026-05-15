"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Download, ExternalLink, Copy, Check } from "lucide-react"
import type { IPFSMediaItem } from "@/types/ipfs"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface FilePreviewProps {
  file: IPFSMediaItem
  className?: string
  showActions?: boolean
}

export function FilePreview({ file, className, showActions = true }: FilePreviewProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "IPFS hash copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadFile = () => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderPreview = () => {
    switch (file.type) {
      case "image":
        return (
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )
      case "video":
        return (
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video src={file.url} className="w-full h-full object-cover" controls preload="metadata" />
          </div>
        )
      case "audio":
        return (
          <div className="p-4 bg-muted rounded-lg">
            <audio src={file.url} controls className="w-full" />
          </div>
        )
      default:
        return (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ExternalLink className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{file.mimeType}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Preview Area */}
        <div className="p-4">{renderPreview()}</div>

        {/* File Info */}
        <div className="p-4 border-t space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium truncate">{file.name}</h4>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)} • {file.mimeType}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0">
              {file.type}
            </Badge>
          </div>

          {/* IPFS Hash */}
          <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs font-mono">
            <span className="truncate flex-1">{file.hash}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(file.hash)}
              className="h-6 w-6 p-0 shrink-0"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{file.name}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">{renderPreview()}</div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" onClick={downloadFile} className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>

              <Button variant="outline" size="sm" onClick={() => window.open(file.url, "_blank")} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
            </div>
          )}

          {/* Upload Date */}
          <p className="text-xs text-muted-foreground">Uploaded {file.uploadedAt.toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
