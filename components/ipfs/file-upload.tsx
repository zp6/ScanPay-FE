"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, File, ImageIcon, Video, Music, FileText } from "lucide-react"
import { useIPFS } from "@/hooks/use-ipfs"
import type { IPFSMediaItem } from "@/types/ipfs"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUploadComplete?: (files: IPFSMediaItem[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedTypes?: string[]
  className?: string
}

export function FileUpload({
  onUploadComplete,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  acceptedTypes = ["image/*", "video/*", "audio/*", "application/pdf"],
  className,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<IPFSMediaItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFile, uploadState } = useIPFS()

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return ImageIcon
    if (mimeType.startsWith("video/")) return Video
    if (mimeType.startsWith("audio/")) return Music
    if (mimeType.includes("pdf")) return FileText
    return File
  }

  const getFileType = (mimeType: string): IPFSMediaItem["type"] => {
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    if (mimeType.includes("pdf") || mimeType.includes("document")) return "document"
    return "other"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`
    }

    const isAccepted = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isAccepted) {
      return "File type not supported"
    }

    return null
  }

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files)

      if (uploadedFiles.length + fileArray.length > maxFiles) {
        return
      }

      setIsUploading(true)
      const newUploadedFiles: IPFSMediaItem[] = []

      for (const file of fileArray) {
        const error = validateFile(file)
        if (error) {
          console.error(`[v0] File validation error: ${error}`)
          continue
        }

        try {
          const result = await uploadFile(file)
          if (result) {
            const mediaItem: IPFSMediaItem = {
              id: crypto.randomUUID(),
              hash: result.hash,
              name: file.name,
              type: getFileType(file.type),
              mimeType: file.type,
              size: file.size,
              url: result.url,
              uploadedAt: new Date(),
            }
            newUploadedFiles.push(mediaItem)
          }
        } catch (error) {
          console.error(`[v0] Upload error for ${file.name}:`, error)
        }
      }

      const allFiles = [...uploadedFiles, ...newUploadedFiles]
      setUploadedFiles(allFiles)
      setIsUploading(false)
      onUploadComplete?.(allFiles)
    },
    [uploadedFiles, maxFiles, uploadFile, onUploadComplete],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const removeFile = useCallback(
    (id: string) => {
      const filtered = uploadedFiles.filter((file) => file.id !== id)
      setUploadedFiles(filtered)
      onUploadComplete?.(filtered)
    },
    [uploadedFiles, onUploadComplete],
  )

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "pointer-events-none opacity-50",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Files to IPFS</h3>
          <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
          <div className="flex flex-wrap gap-2 justify-center text-sm text-muted-foreground">
            <Badge variant="outline">Images</Badge>
            <Badge variant="outline">Videos</Badge>
            <Badge variant="outline">Audio</Badge>
            <Badge variant="outline">Documents</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Max {maxFiles} files, {formatFileSize(maxSize)} each
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload Progress */}
      {uploadState.status === "uploading" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-primary animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-medium">Uploading to IPFS...</p>
                <Progress value={uploadState.progress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Uploaded Files ({uploadedFiles.length})</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => {
                const IconComponent = getFileIcon(file.mimeType)
                return (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      IPFS
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-8 w-8 p-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
