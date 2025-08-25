"use client"

import { useState } from "react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { WalletConnectModal } from "@/components/auth/wallet-connect-modal"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {isSignUp ? (
          <SignUpForm onToggleMode={() => setIsSignUp(false)} onWalletConnect={() => setShowWalletModal(true)} />
        ) : (
          <SignInForm onToggleMode={() => setIsSignUp(true)} onWalletConnect={() => setShowWalletModal(true)} />
        )}
      </div>

      <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </div>
  )
}
