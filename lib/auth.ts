// Authentication utilities and types for ScanPay
export interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  walletAddress?: string
  provider: "google" | "apple" | "email" | "wallet"
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication functions - replace with real implementation
export const authService = {
  async signInWithGoogle(): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: "1",
      email: "user@gmail.com",
      name: "John Doe",
      avatar: "/diverse-user-avatars.png",
      provider: "google",
      createdAt: new Date(),
    }
  },

  async signInWithApple(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: "2",
      email: "user@icloud.com",
      name: "Jane Smith",
      avatar: "/diverse-user-avatars.png",
      provider: "apple",
      createdAt: new Date(),
    }
  },

  async signInWithEmail(email: string, password: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: "3",
      email,
      name: email.split("@")[0],
      provider: "email",
      createdAt: new Date(),
    }
  },

  async signUp(email: string, password: string, name: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: "4",
      email,
      name,
      provider: "email",
      createdAt: new Date(),
    }
  },

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
  },

  async connectWallet(address: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: "5",
      walletAddress: address,
      name: `${address.slice(0, 6)}...${address.slice(-4)}`,
      provider: "wallet",
      createdAt: new Date(),
    }
  },
}
