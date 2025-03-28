"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function JoinMovieNight() {
  const router = useRouter()
  const [token, setToken] = useState("")

  const handleJoin = () => {
    if (!token || token.length !== 5) {
      toast({
        title: "Invalid token",
        description: "Please enter a valid 5-character token.",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would validate the token against a database
    // For this demo, we'll check localStorage
    const movieNight = localStorage.getItem(`movieNight_${token}`)

    if (!movieNight) {
      toast({
        title: "Movie night not found",
        description: "The token you entered doesn't match any active movie nights.",
        variant: "destructive",
      })
      return
    }

    router.push(`/night/${token}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join a Movie Night</CardTitle>
          <CardDescription>Enter the 5-character token to join an existing movie night.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Movie Night Token</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value.slice(0, 5))}
                placeholder="Enter 5-character token"
                className="font-mono text-center text-lg"
                maxLength={5}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleJoin} className="w-full">
            Join Movie Night
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

