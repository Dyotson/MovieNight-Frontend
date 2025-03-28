"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(
          "https://movie-night-backend-zeta.vercel.app/api/movies/popular"
        );
        const data = await response.json();

        if (data.success && Array.isArray(data.results)) {
          setPopularMovies(data.results);
        }
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  // Dividir las películas en filas para el efecto visual
  const row1 = popularMovies.slice(0, 7);
  const row2 = popularMovies.slice(7, 14);
  const row3 = popularMovies.slice(14);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo animado de posters */}
      {!loading && (
        <div className="absolute inset-0 w-full h-full -z-10 opacity-20">
          <div className="poster-row row-1">
            {row1.concat(row1).map((movie, index) => (
              <div key={`row1-${movie.id}-${index}`} className="poster-item">
                <img
                  src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                  alt={movie.title}
                  className="h-40 rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
          <div className="poster-row row-2">
            {row2.concat(row2).map((movie, index) => (
              <div key={`row2-${movie.id}-${index}`} className="poster-item">
                <img
                  src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                  alt={movie.title}
                  className="h-40 rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
          <div className="poster-row row-3">
            {row3.concat(row3).map((movie, index) => (
              <div key={`row3-${movie.id}-${index}`} className="poster-item">
                <img
                  src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                  alt={movie.title}
                  className="h-40 rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative z-10">
        <div className="max-w-3xl w-full text-center space-y-6 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Movie-Night
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Plan the perfect movie night with friends! Propose movies, vote for
            your favorites, and let everyone contribute to deciding what to
            watch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/create">
              <Button size="lg" className="w-full sm:w-auto">
                Create a Movie Night
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/join">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Join a Movie Night
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Estilos para las animaciones */}
      <style jsx>{`
        .poster-row {
          display: flex;
          gap: 20px;
          position: absolute;
          width: max-content;
        }

        .poster-item {
          flex-shrink: 0;
        }

        .row-1 {
          top: 10%;
          animation: slideRight 80s linear infinite;
        }

        .row-2 {
          top: 40%;
          animation: slideLeft 90s linear infinite;
        }

        .row-3 {
          top: a70%;
          animation: slideRight 70s linear infinite;
        }

        @keyframes slideRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        @keyframes slideLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
