"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Cloud, Upload, FolderOpen, Plus, TrendingUp } from "lucide-react"
import { FileUpload } from "@/components/ipfs/file-upload"
import { MediaGallery } from "@/components/ipfs/media-gallery"
import type { IPFSMediaItem } from "@/types/ipfs"
import { motion } from "framer-motion"

export function IPFSSection() {
  const [uploadedFiles, setUploadedFiles] = useState<IPFSMediaItem[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  // Load files from localStorage on mount (in a real app, this would come from a database)
  useEffect(() => {
    const savedFiles = localStorage.getItem("scanpay-ipfs-files")
    if (savedFiles) {
      try {
        const files = JSON.parse(savedFiles)
        setUploadedFiles(files)
      } catch (error) {
        console.error("[v0] Error loading saved IPFS files:", error)
      }
    }
  }, [])

  // Save files to localStorage whenever files change
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      localStorage.setItem("scanpay-ipfs-files", JSON.stringify(uploadedFiles))
    }
  }, [uploadedFiles])

  const handleUploadComplete = (files: IPFSMediaItem[]) => {
    setUploadedFiles(files)
    setIsUploadDialogOpen(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0)
  const fileTypes = uploadedFiles.reduce(
    (acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Cloud className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="flex items-center gap-2">
                IPFS Storage
                <Badge variant="outline" className="text-xs">
                  Decentralized
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Store your files on the InterPlanetary File System</p>
            </div>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Upload Files to IPFS</DialogTitle>
              </DialogHeader>
              <FileUpload onUploadComplete={handleUploadComplete} maxFiles={20} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Cloud className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start uploading your files to IPFS for decentralized storage
                </p>
                <Button onClick={() => setIsUploadDialogOpen(true)} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Your First File
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{uploadedFiles.length}</p>
                      <p className="text-sm text-muted-foreground">Total Files</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Cloud className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
                      <p className="text-sm text-muted-foreground">Total Size</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:col-span-2">
                  <h4 className="font-semibold mb-3">File Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(fileTypes).map(([type, count]) => (
                      <Badge key={type} variant="outline">
                        {type}: {count}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gallery">
            {uploadedFiles.length > 0 ? (
              <MediaGallery files={uploadedFiles} />
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No files to display</h3>
                <p className="text-muted-foreground">Upload some files to see them in the gallery</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload onUploadComplete={handleUploadComplete} maxFiles={20} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
