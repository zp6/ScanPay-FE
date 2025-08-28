// IPFS-related type definitions

export interface IPFSFile {
  hash: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  pinned?: boolean
}

export interface IPFSUploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface IPFSUploadResult {
  hash: string
  url: string
  size: number
}

export interface IPFSMetadata {
  name: string
  description?: string
  image?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
  animation_url?: string
}

export interface IPFSMediaItem {
  id: string
  hash: string
  name: string
  type: "image" | "video" | "audio" | "document" | "other"
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  metadata?: IPFSMetadata
  tags?: string[]
  uploadedAt: Date
  lastAccessed?: Date
}

export interface IPFSGallery {
  id: string
  name: string
  description?: string
  items: IPFSMediaItem[]
  createdAt: Date
  updatedAt: Date
}

export type IPFSUploadStatus = "idle" | "uploading" | "success" | "error"

export interface IPFSUploadState {
  status: IPFSUploadStatus
  progress: number
  error?: string
  result?: IPFSUploadResult
}
