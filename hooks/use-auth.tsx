"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type AuthState, authService } from "@/lib/auth"

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  connectWallet: (address: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        // In a real app, check for stored tokens/session
        const storedUser = localStorage.getItem("scanpay-user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    checkAuth()
  }, [])

  const signInWithGoogle = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.signInWithGoogle()
      localStorage.setItem("scanpay-user", JSON.stringify(user))
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signInWithApple = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.signInWithApple()
      localStorage.setItem("scanpay-user", JSON.stringify(user))
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.signInWithEmail(email, password)
      localStorage.setItem("scanpay-user", JSON.stringify(user))
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.signUp(email, password, name)
      localStorage.setItem("scanpay-user", JSON.stringify(user))
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signOut = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      await authService.signOut()
      localStorage.removeItem("scanpay-user")
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const connectWallet = async (address: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const user = await authService.connectWallet(address)
      localStorage.setItem("scanpay-user", JSON.stringify(user))
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithGoogle,
        signInWithApple,
        signInWithEmail,
        signUp,
        signOut,
        connectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
