"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Camera, Flashlight, Upload } from "lucide-react"
import { qrService } from "@/lib/qr-scanner"

interface QRScannerProps {
  onScanResult: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScanResult, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setHasPermission(true)
        setIsScanning(true)
      }
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.")
      setHasPermission(false)
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const handleManualInput = () => {
    // For demo purposes, generate a sample QR
    const sampleQR = qrService.generateSampleQR()
    onScanResult(sampleQR)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd use a QR code library to decode the image
      // For demo, we'll use a sample QR
      const sampleQR = qrService.generateSampleQR()
      onScanResult(sampleQR)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 text-white">
        <h2 className="text-lg font-semibold">Scan QR Code</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative">
        {hasPermission && <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />}

        {/* Scanner Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Scanner Frame */}
            <div className="w-64 h-64 border-2 border-white rounded-lg relative">
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />

              {/* Scanning line animation */}
              {isScanning && (
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-primary animate-pulse"
                  style={{ animation: "scan 2s linear infinite" }}
                />
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center text-white">
              <p className="text-lg font-medium">Position QR code in frame</p>
              <p className="text-sm text-white/70 mt-1">The code will be scanned automatically</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <Card className="mx-4 max-w-sm">
              <CardContent className="p-6 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Camera Access Required</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={startCamera} className="w-full">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-black/50">
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <Flashlight className="w-5 h-5" />
          </Button>

          <Button onClick={handleManualInput} className="flex-1 max-w-xs">
            <Camera className="w-4 h-4 mr-2" />
            Demo Scan
          </Button>

          <label className="cursor-pointer">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              asChild
            >
              <div>
                <Upload className="w-5 h-5" />
              </div>
            </Button>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="flex justify-center mt-3">
          <Badge variant="secondary" className="bg-white/20 text-white">
            Point camera at QR code
          </Badge>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
      `}</style>
    </div>
  )
}
