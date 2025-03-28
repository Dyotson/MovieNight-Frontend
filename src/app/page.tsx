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
          // Duplicar los resultados para tener suficientes posters
          const duplicatedMovies = [...data.results, ...data.results];
          setPopularMovies(duplicatedMovies);
        }
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo de posters al estilo Plex */}
      {!loading && (
        <div className="absolute inset-0 w-full h-full -z-10">
          <div className="poster-grid">
            {popularMovies.map((movie, index) => (
              <div key={`poster-${movie.id}-${index}`} className="poster-item">
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="poster-image"
                />
              </div>
            ))}
          </div>
          {/* Capa de oscurecimiento para mejor legibilidad */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative z-10">
        <div className="max-w-3xl w-full text-center space-y-6 bg-background/60 backdrop-blur-md p-8 rounded-lg shadow-lg">
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

      {/* Estilos para el grid de posters */}
      <style jsx>{`
        .poster-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .poster-item {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .poster-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.1);
          transition: transform 2s ease-in-out;
        }

        .poster-item:nth-child(odd) .poster-image {
          animation: subtle-zoom 15s infinite alternate;
        }

        .poster-item:nth-child(even) .poster-image {
          animation: subtle-zoom 18s infinite alternate-reverse;
        }

        @keyframes subtle-zoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  );
}
