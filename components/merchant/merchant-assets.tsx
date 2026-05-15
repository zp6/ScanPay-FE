"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileUpload } from "@/components/ipfs/file-upload"
import { MediaGallery } from "@/components/ipfs/media-gallery"
import { Building2, Upload, ImageIcon, FileText, Plus, Briefcase } from "lucide-react"
import type { IPFSMediaItem } from "@/types/ipfs"
import { motion } from "framer-motion"

export function MerchantAssets() {
  const [businessAssets, setBusinessAssets] = useState<IPFSMediaItem[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const handleUploadComplete = (files: IPFSMediaItem[]) => {
    setBusinessAssets(files)
    setIsUploadDialogOpen(false)
  }

  const logoFiles = businessAssets.filter((file) => file.type === "image")
  const documentFiles = businessAssets.filter((file) => file.type === "document")

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Building2 className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Business Assets
                <Badge variant="outline" className="text-xs">
                  IPFS Storage
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Store your business logos, documents, and branding materials
              </p>
            </div>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Assets
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Upload Business Assets</DialogTitle>
              </DialogHeader>
              <FileUpload
                onUploadComplete={handleUploadComplete}
                maxFiles={20}
                acceptedTypes={[
                  "image/*",
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ]}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <Briefcase className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="logos" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Logos
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {businessAssets.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">No business assets yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your business logos, documents, and branding materials to IPFS
                </p>
                <Button onClick={() => setIsUploadDialogOpen(true)} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Your First Asset
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{logoFiles.length}</p>
                      <p className="text-sm text-muted-foreground">Logos & Images</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{documentFiles.length}</p>
                      <p className="text-sm text-muted-foreground">Documents</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{businessAssets.length}</p>
                      <p className="text-sm text-muted-foreground">Total Assets</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logos">
            {logoFiles.length > 0 ? (
              <MediaGallery files={logoFiles} />
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No logos uploaded</h3>
                <p className="text-muted-foreground">Upload your business logos and branding images</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents">
            {documentFiles.length > 0 ? (
              <MediaGallery files={documentFiles} />
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents uploaded</h3>
                <p className="text-muted-foreground">Upload business documents, contracts, and certificates</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload
              onUploadComplete={handleUploadComplete}
              maxFiles={20}
              acceptedTypes={[
                "image/*",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
