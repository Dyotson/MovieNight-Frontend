"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import MovieCard from "@/components/movie-card"
import { searchMovies } from "@/lib/tmdb"

interface MovieNight {
  name: string
  date: string
  time: string
  limitProposals: boolean
  maxProposals: number | null
  token: string
  proposals: MovieProposal[]
}

interface MovieProposal {
  id: number
  title: string
  posterPath: string
  votes: number
  proposedBy: string
}

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
}

export default function MovieNightPage() {
  const params = useParams()
  const token = params.token as string

  const [movieNight, setMovieNight] = useState<MovieNight | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [username, setUsername] = useState("")
  const [usernameSet, setUsernameSet] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    // In a real app, we would fetch this from a database
    const storedMovieNight = localStorage.getItem(`movieNight_${token}`)

    if (storedMovieNight) {
      setMovieNight(JSON.parse(storedMovieNight))
    } else {
      toast({
        title: "Movie night not found",
        description: "The movie night you're looking for doesn't exist or has been deleted.",
        variant: "destructive",
      })
    }

    // Check if username is already set in localStorage
    const storedUsername = localStorage.getItem(`username_${token}`)
    if (storedUsername) {
      setUsername(storedUsername)
      setUsernameSet(true)
    }
  }, [token])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchMovies(searchQuery)
      setSearchResults(results)
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search for movies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectMovie = async (movie: Movie) => {
    setSelectedMovie(movie)
    setSearchResults([])
    setSearchQuery("")
  }

  const handleProposeMovie = () => {
    if (!selectedMovie || !movieNight) return

    // Check if movie is already proposed
    const isAlreadyProposed = movieNight.proposals.some((proposal) => proposal.id === selectedMovie.id)

    if (isAlreadyProposed) {
      // Vote for the movie instead
      handleVoteForMovie(selectedMovie.id)
      return
    }

    // Check if user has reached proposal limit
    if (movieNight.limitProposals) {
      const userProposals = movieNight.proposals.filter((proposal) => proposal.proposedBy === username)

      if (userProposals.length >= (movieNight.maxProposals || 0)) {
        toast({
          title: "Proposal limit reached",
          description: `You can only propose up to ${movieNight.maxProposals} movies.`,
          variant: "destructive",
        })
        return
      }
    }

    // Add new proposal
    const newProposal: MovieProposal = {
      id: selectedMovie.id,
      title: selectedMovie.title,
      posterPath: selectedMovie.poster_path,
      votes: 1, // Auto-vote for your own proposal
      proposedBy: username,
    }

    const updatedMovieNight = {
      ...movieNight,
      proposals: [...movieNight.proposals, newProposal],
    }

    // Update localStorage
    localStorage.setItem(`movieNight_${token}`, JSON.stringify(updatedMovieNight))

    setMovieNight(updatedMovieNight)
    setSelectedMovie(null)

    toast({
      title: "Movie proposed",
      description: `You proposed "${selectedMovie.title}" and voted for it.`,
    })
  }

  const handleVoteForMovie = (movieId: number) => {
    if (!movieNight) return

    // Check if movie exists in proposals
    const movieIndex = movieNight.proposals.findIndex((proposal) => proposal.id === movieId)

    if (movieIndex === -1) return

    // Update votes
    const updatedProposals = [...movieNight.proposals]
    updatedProposals[movieIndex] = {
      ...updatedProposals[movieIndex],
      votes: updatedProposals[movieIndex].votes + 1,
    }

    // Sort by votes (descending)
    updatedProposals.sort((a, b) => b.votes - a.votes)

    const updatedMovieNight = {
      ...movieNight,
      proposals: updatedProposals,
    }

    // Update localStorage
    localStorage.setItem(`movieNight_${token}`, JSON.stringify(updatedMovieNight))

    setMovieNight(updatedMovieNight)

    toast({
      title: "Vote recorded",
      description: `You voted for "${updatedProposals[movieIndex].title}".`,
    })
  }

  const handleSetUsername = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue.",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem(`username_${token}`, username)
    setUsernameSet(true)

    toast({
      title: "Username set",
      description: `You're now participating as "${username}".`,
    })
  }

  if (!movieNight) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-3/4" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-1/2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!usernameSet) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join {movieNight.name}</CardTitle>
            <CardDescription>Enter a username to participate in this movie night.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Your Name</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSetUsername} className="w-full">
              Join Movie Night
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl">{movieNight.name}</CardTitle>
              <CardDescription className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {format(new Date(movieNight.date), "EEEE, MMMM d, yyyy")}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {movieNight.time}
                </span>
              </CardDescription>
            </div>
            <Badge variant="outline" className="self-start md:self-auto">
              Participating as {username}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for movies to propose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
              <Button onClick={handleSearch} className="absolute right-0 top-0 rounded-l-none" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-muted p-4 rounded-lg max-h-[300px] overflow-y-auto">
                <h3 className="font-medium mb-2">Search Results</h3>
                <div className="grid gap-2">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-3 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => handleSelectMovie(movie)}
                    >
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          className="w-12 h-18 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-18 bg-muted-foreground/20 rounded flex items-center justify-center">
                          No image
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{movie.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {movie.release_date ? format(new Date(movie.release_date), "yyyy") : "Unknown year"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMovie && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  {selectedMovie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w154${selectedMovie.poster_path}`}
                      alt={selectedMovie.title}
                      className="w-[154px] object-cover rounded self-center md:self-start"
                    />
                  ) : (
                    <div className="w-[154px] h-[231px] bg-muted-foreground/20 rounded flex items-center justify-center self-center md:self-start">
                      No image
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedMovie.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedMovie.release_date
                        ? format(new Date(selectedMovie.release_date), "yyyy")
                        : "Unknown year"}
                    </p>
                    <p className="text-sm mb-4">{selectedMovie.overview}</p>
                    <div className="flex gap-2">
                      <Button onClick={handleProposeMovie}>
                        {movieNight.proposals.some((p) => p.id === selectedMovie.id)
                          ? "Vote for this movie"
                          : "Propose this movie"}
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedMovie(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Proposed Movies</h2>
      {movieNight.proposals.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">No movies have been proposed yet.</p>
          <p className="text-muted-foreground">Search for a movie above to make the first proposal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movieNight.proposals.map((proposal) => (
            <MovieCard key={proposal.id} movie={proposal} onVote={() => handleVoteForMovie(proposal.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

