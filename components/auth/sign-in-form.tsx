"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail } from "lucide-react"

interface SignInFormProps {
  onToggleMode: () => void
  onWalletConnect: () => void
}

export function SignInForm({ onToggleMode, onWalletConnect }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle, signInWithApple, signInWithEmail } = useAuth()
  const { toast } = useToast()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    try {
      await signInWithEmail(email, password)
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    setIsLoading(true)
    try {
      if (provider === "google") {
        await signInWithGoogle()
      } else {
        await signInWithApple()
      }
      toast({
        title: "Welcome to ScanPay!",
        description: "You have successfully signed in.",
      })
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your ScanPay account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Sign In */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => handleSocialSignIn("google")}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <div className="w-4 h-4 mr-2 bg-red-500 rounded-full" />
            )}
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => handleSocialSignIn("apple")}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <div className="w-4 h-4 mr-2 bg-black rounded-sm" />
            )}
            Continue with Apple
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Email Sign In */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
            Sign In
          </Button>
        </form>

        <Separator />

        <Button variant="outline" className="w-full bg-transparent" onClick={onWalletConnect}>
          Connect Wallet
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button variant="link" className="p-0 h-auto font-normal" onClick={onToggleMode}>
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
