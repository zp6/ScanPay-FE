import { create, type IPFSHTTPClient } from "ipfs-http-client"

// IPFS client configuration
const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL || "https://ipfs.infura.io:5001"
const IPFS_GATEWAY_URL = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL || "https://ipfs.io/ipfs"

let ipfsClient: IPFSHTTPClient | null = null

// Initialize IPFS client
export const getIPFSClient = (): IPFSHTTPClient => {
  if (!ipfsClient) {
    ipfsClient = create({
      url: IPFS_API_URL,
      headers: {
        authorization:
          process.env.NEXT_PUBLIC_IPFS_PROJECT_ID && process.env.NEXT_PUBLIC_IPFS_PROJECT_SECRET
            ? `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_IPFS_PROJECT_ID}:${process.env.NEXT_PUBLIC_IPFS_PROJECT_SECRET}`).toString("base64")}`
            : undefined,
      },
    })
  }
  return ipfsClient
}

// Upload file to IPFS
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    const client = getIPFSClient()
    const result = await client.add(file, {
      progress: (prog) => console.log(`[v0] IPFS upload progress: ${prog}`),
    })

    console.log(`[v0] File uploaded to IPFS: ${result.cid.toString()}`)
    return result.cid.toString()
  } catch (error) {
    console.error("[v0] Error uploading to IPFS:", error)
    throw new Error("Failed to upload file to IPFS")
  }
}

// Upload JSON data to IPFS
export const uploadJSONToIPFS = async (data: any): Promise<string> => {
  try {
    const client = getIPFSClient()
    const jsonString = JSON.stringify(data)
    const result = await client.add(jsonString, {
      progress: (prog) => console.log(`[v0] IPFS JSON upload progress: ${prog}`),
    })

    console.log(`[v0] JSON uploaded to IPFS: ${result.cid.toString()}`)
    return result.cid.toString()
  } catch (error) {
    console.error("[v0] Error uploading JSON to IPFS:", error)
    throw new Error("Failed to upload JSON to IPFS")
  }
}

// Get IPFS URL for a given hash
export const getIPFSUrl = (hash: string): string => {
  return `${IPFS_GATEWAY_URL}/${hash}`
}

// Fetch data from IPFS
export const fetchFromIPFS = async (hash: string): Promise<any> => {
  try {
    const response = await fetch(getIPFSUrl(hash))
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    }

    return await response.text()
  } catch (error) {
    console.error("[v0] Error fetching from IPFS:", error)
    throw new Error("Failed to fetch data from IPFS")
  }
}

// Pin file to IPFS (for persistence)
export const pinToIPFS = async (hash: string): Promise<void> => {
  try {
    const client = getIPFSClient()
    await client.pin.add(hash)
    console.log(`[v0] File pinned to IPFS: ${hash}`)
  } catch (error) {
    console.error("[v0] Error pinning to IPFS:", error)
    throw new Error("Failed to pin file to IPFS")
  }
}

// Validate IPFS hash format
export const isValidIPFSHash = (hash: string): boolean => {
  // Basic validation for IPFS CID (Content Identifier)
  const ipfsHashRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$|^bafy[a-z2-7]{55}$/
  return ipfsHashRegex.test(hash)
}

// Get file info from IPFS
export const getIPFSFileInfo = async (hash: string) => {
  try {
    const client = getIPFSClient()
    const stats = await client.files.stat(`/ipfs/${hash}`)
    return {
      hash,
      size: stats.size,
      type: stats.type,
      url: getIPFSUrl(hash),
    }
  } catch (error) {
    console.error("[v0] Error getting IPFS file info:", error)
    throw new Error("Failed to get file info from IPFS")
  }
}
