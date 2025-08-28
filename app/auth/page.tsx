"use client"

import { useState } from "react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { WalletConnectModal } from "@/components/auth/wallet-connect-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn } from "@/components/ui/fade-in"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <FadeIn delay={0.2}>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      </FadeIn>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {isSignUp ? (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <SignUpForm onToggleMode={() => setIsSignUp(false)} onWalletConnect={() => setShowWalletModal(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <SignInForm onToggleMode={() => setIsSignUp(true)} onWalletConnect={() => setShowWalletModal(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </div>
  )
}
