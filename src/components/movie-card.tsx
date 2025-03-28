"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"

interface MovieCardProps {
  movie: {
    id: number
    title: string
    posterPath: string
    votes: number
    proposedBy: string
  }
  onVote: () => void
}

export default function MovieCard({ movie, onVote }: MovieCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[2/3] w-full">
        {movie.posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
            alt={movie.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">No image</div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold truncate" title={movie.title}>
          {movie.title}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-muted-foreground">Proposed by {movie.proposedBy}</div>
          <div className="flex items-center gap-1 font-bold">
            <ThumbsUp className="h-4 w-4" />
            {movie.votes}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={onVote} variant="outline" className="w-full">
          Vote
        </Button>
      </CardFooter>
    </Card>
  )
}

