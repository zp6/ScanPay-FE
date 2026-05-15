"use client"

import { useState, useCallback } from "react"
import { uploadToIPFS, uploadJSONToIPFS, fetchFromIPFS, getIPFSUrl, pinToIPFS } from "@/lib/ipfs"
import type { IPFSUploadState, IPFSUploadResult } from "@/types/ipfs"
import { useToast } from "@/hooks/use-toast"

export const useIPFS = () => {
  const [uploadState, setUploadState] = useState<IPFSUploadState>({
    status: "idle",
    progress: 0,
  })
  const { toast } = useToast()

  const uploadFile = useCallback(
    async (file: File): Promise<IPFSUploadResult | null> => {
      setUploadState({ status: "uploading", progress: 0 })

      try {
        const hash = await uploadToIPFS(file)
        const result: IPFSUploadResult = {
          hash,
          url: getIPFSUrl(hash),
          size: file.size,
        }

        setUploadState({ status: "success", progress: 100, result })
        toast({
          title: "Upload Successful",
          description: `File uploaded to IPFS: ${file.name}`,
        })

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed"
        setUploadState({ status: "error", progress: 0, error: errorMessage })
        toast({
          title: "Upload Failed",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      }
    },
    [toast],
  )

  const uploadJSON = useCallback(
    async (data: any): Promise<string | null> => {
      setUploadState({ status: "uploading", progress: 0 })

      try {
        const hash = await uploadJSONToIPFS(data)
        setUploadState({ status: "success", progress: 100 })
        toast({
          title: "JSON Upload Successful",
          description: `Data uploaded to IPFS`,
        })
        return hash
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "JSON upload failed"
        setUploadState({ status: "error", progress: 0, error: errorMessage })
        toast({
          title: "JSON Upload Failed",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      }
    },
    [toast],
  )

  const fetchData = useCallback(
    async (hash: string) => {
      try {
        const data = await fetchFromIPFS(hash)
        return data
      } catch (error) {
        toast({
          title: "Fetch Failed",
          description: "Failed to fetch data from IPFS",
          variant: "destructive",
        })
        return null
      }
    },
    [toast],
  )

  const pinFile = useCallback(
    async (hash: string) => {
      try {
        await pinToIPFS(hash)
        toast({
          title: "File Pinned",
          description: "File has been pinned to IPFS for persistence",
        })
      } catch (error) {
        toast({
          title: "Pin Failed",
          description: "Failed to pin file to IPFS",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const resetUploadState = useCallback(() => {
    setUploadState({ status: "idle", progress: 0 })
  }, [])

  return {
    uploadState,
    uploadFile,
    uploadJSON,
    fetchData,
    pinFile,
    resetUploadState,
    getIPFSUrl,
  }
}
