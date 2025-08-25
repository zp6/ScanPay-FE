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
import { Loader2, UserPlus } from "lucide-react"

interface SignUpFormProps {
  onToggleMode: () => void
  onWalletConnect: () => void
}

export function SignUpForm({ onToggleMode, onWalletConnect }: SignUpFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle, signInWithApple, signUp } = useAuth()
  const { toast } = useToast()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return

    setIsLoading(true)
    try {
      await signUp(email, password, name)
      toast({
        title: "Welcome to ScanPay!",
        description: "Your account has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "Please try again.",
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
        description: "Your account has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Sign up failed",
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
        <CardTitle className="text-2xl font-bold">Create account</CardTitle>
        <CardDescription>Get started with ScanPay today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Sign Up */}
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

        {/* Email Sign Up */}
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Create Account
          </Button>
        </form>

        <Separator />

        <Button variant="outline" className="w-full bg-transparent" onClick={onWalletConnect}>
          Connect Wallet
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Button variant="link" className="p-0 h-auto font-normal" onClick={onToggleMode}>
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
