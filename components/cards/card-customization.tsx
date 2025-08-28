"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ipfs/file-upload"
import { MediaGallery } from "@/components/ipfs/media-gallery"
import { Palette, Upload, ImageIcon, Sparkles } from "lucide-react"
import type { IPFSMediaItem } from "@/types/ipfs"
import { cn } from "@/lib/utils"

interface CardCustomizationProps {
  cardId?: string
  compact?: boolean
  className?: string
}

export function CardCustomization({ cardId, compact = false, className }: CardCustomizationProps) {
  const [cardDesigns, setCardDesigns] = useState<IPFSMediaItem[]>([])
  const [selectedDesign, setSelectedDesign] = useState<IPFSMediaItem | null>(null)

  const handleUploadComplete = (files: IPFSMediaItem[]) => {
    // Filter only images for card designs
    const imageFiles = files.filter((file) => file.type === "image")
    setCardDesigns(imageFiles)
  }

  const handleDesignSelect = (design: IPFSMediaItem) => {
    setSelectedDesign(design)
  }

  const cardPreviewStyles = selectedDesign
    ? { backgroundImage: `url(${selectedDesign.url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {}

  if (compact) {
    return (
      <div className={cn("space-y-4", className)}>
        <FileUpload
          onUploadComplete={handleUploadComplete}
          maxFiles={5}
          acceptedTypes={["image/*"]}
          className="max-h-48"
        />

        {cardDesigns.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {cardDesigns.slice(0, 4).map((design) => (
              <div
                key={design.id}
                className={cn(
                  "aspect-video rounded-lg border-2 cursor-pointer transition-all",
                  selectedDesign?.id === design.id ? "border-primary" : "border-muted",
                )}
                onClick={() => handleDesignSelect(design)}
              >
                <img
                  src={design.url || "/placeholder.svg"}
                  alt={design.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="flex items-center gap-2">
              Card Customization
              <Badge variant="outline" className="text-xs">
                IPFS Powered
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Create unique card designs with decentralized storage</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold mb-4">Card Preview</h3>

              {/* Card Preview */}
              <div className="max-w-sm mx-auto">
                <div
                  className="aspect-[1.6/1] rounded-xl p-6 text-white relative overflow-hidden shadow-lg"
                  style={
                    selectedDesign
                      ? cardPreviewStyles
                      : { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }
                  }
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-sm font-medium">ScanPay</div>
                      <div className="text-xs opacity-75">VIRTUAL</div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-lg font-mono tracking-wider">•••• •••• •••• 1234</div>

                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-75">CARDHOLDER</div>
                          <div className="text-sm font-medium">JOHN DOE</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-75">EXPIRES</div>
                          <div className="text-sm font-medium">12/28</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedDesign && <div className="absolute inset-0 bg-black/20 z-0" />}
                </div>
              </div>

              {selectedDesign && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{selectedDesign.name}</p>
                  <p className="text-xs text-muted-foreground">Stored on IPFS: {selectedDesign.hash.slice(0, 12)}...</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload onUploadComplete={handleUploadComplete} maxFiles={10} acceptedTypes={["image/*"]} />
          </TabsContent>

          <TabsContent value="gallery">
            {cardDesigns.length > 0 ? (
              <MediaGallery files={cardDesigns} onFileSelect={handleDesignSelect} selectable />
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No designs uploaded</h3>
                <p className="text-muted-foreground">Upload some images to create custom card designs</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
