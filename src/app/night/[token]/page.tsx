"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCard from "@/components/movie-card";
import { searchMovies } from "@/lib/tmdb";
import {
  getMovieNight,
  joinMovieNight,
  proposeMovie,
  voteForMovie,
  MovieNight as MovieNightType,
  MovieProposal,
} from "@/lib/movie-night-api";

// Actualizar las interfaces para que coincidan con la API
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
}

export default function MovieNightPage() {
  const params = useParams();
  const token = params.token as string;

  const [movieNight, setMovieNight] = useState<MovieNightType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameSet, setUsernameSet] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<number[]>([]);
  const [votesRemaining, setVotesRemaining] = useState<number | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    async function loadMovieNight() {
      try {
        // Verificar si hay un nombre de usuario guardado
        const storedUsername = localStorage.getItem(`username_${token}`);

        if (storedUsername) {
          setUsername(storedUsername);
          setUsernameSet(true);

          // Obtener los datos de la sesión con info del usuario
          const response = await getMovieNight(token, storedUsername);
          setMovieNight(response.movieNight);
          setUserVotes(response.userVotes || []);
          setVotesRemaining(response.votesRemaining);
        } else {
          // Obtener solo datos básicos
          const response = await getMovieNight(token);
          setMovieNight(response.movieNight);
        }
      } catch (error) {
        toast.error("Movie night not found", {
          description:
            "The movie night you're looking for doesn't exist or has been deleted.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadMovieNight();
  }, [token]);

  // Manejar búsqueda de películas
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error("Search failed", {
        description: "Failed to search for movies. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Seleccionar película
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Proponer película
  const handleProposeMovie = async () => {
    if (!selectedMovie || !movieNight || !username) return;

    // Verificar si la película ya está propuesta
    const isAlreadyProposed = movieNight.movies.some(
      (proposal) => proposal.tmdbId === selectedMovie.id
    );

    if (isAlreadyProposed) {
      // Votar por la película existente
      handleVoteForMovie(selectedMovie.id);
      return;
    }

    try {
      const response = await proposeMovie(token, {
        movie: {
          tmdbId: selectedMovie.id,
          title: selectedMovie.title,
          poster_path: selectedMovie.poster_path,
          overview: selectedMovie.overview,
          release_date: selectedMovie.release_date,
        },
        proposedBy: username,
      });

      // Actualizar estado local
      setMovieNight(response.movieNight);
      setUserVotes(response.userVotes || []);
      setVotesRemaining(response.votesRemaining);
      setSelectedMovie(null);

      toast.success("Movie proposed", {
        description: `You proposed "${selectedMovie.title}" and voted for it.`,
      });
    } catch (error) {
      toast.error("Failed to propose movie", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  // Votar por película
  const handleVoteForMovie = async (tmdbId: number) => {
    if (!movieNight || !username) return;

    try {
      const response = await voteForMovie(token, tmdbId, username);

      // Actualizar estado local
      setMovieNight({
        ...movieNight,
        movies: response.movies,
      });
      setUserVotes(response.userVotes || []);
      setVotesRemaining(response.votesRemaining);

      toast.success("Vote recorded", {
        description: `You voted for "${response.movie.title}".`,
      });
    } catch (error) {
      toast.error("Failed to vote", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  // Unirse a la sesión (establecer nombre de usuario)
  const handleSetUsername = async () => {
    if (!username.trim()) {
      toast.error("Username required", {
        description: "Please enter a username to continue.",
      });
      return;
    }

    try {
      const response = await joinMovieNight(token, username);

      // Actualizar estado local
      setMovieNight(response.movieNight);
      setUserVotes(response.user.votedFor || []);
      setVotesRemaining(response.user.votesRemaining);
      setUsernameSet(true);

      // Guardar en localStorage para futuras visitas
      localStorage.setItem(`username_${token}`, username);

      toast.success("Username set", {
        description: `You're now participating as "${username}".`,
      });
    } catch (error) {
      toast.error("Failed to join", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

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
    );
  }

  if (!usernameSet) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join {movieNight.name}</CardTitle>
            <CardDescription>
              Enter a username to participate in this movie night.
            </CardDescription>
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
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl">
                {movieNight.name}
              </CardTitle>
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
              <Button
                onClick={handleSearch}
                className="absolute right-0 top-0 rounded-l-none"
                disabled={isSearching}
              >
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
                          {movie.release_date
                            ? format(new Date(movie.release_date), "yyyy")
                            : "Unknown year"}
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
                        {movieNight.movies.some(
                          (p) => p.tmdbId === selectedMovie.id
                        )
                          ? "Vote for this movie"
                          : "Propose this movie"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedMovie(null)}
                      >
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
      {movieNight.movies.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No movies have been proposed yet.
          </p>
          <p className="text-muted-foreground">
            Search for a movie above to make the first proposal!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movieNight.movies.map((proposal) => (
            <MovieCard
              key={proposal.tmdbId}
              movie={proposal}
              onVote={() => handleVoteForMovie(proposal.tmdbId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
