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

  // Dividimos las 20 películas en 4 filas de 5 películas
  const row1 = popularMovies.slice(0, 5);
  const row2 = popularMovies.slice(5, 10);
  const row3 = popularMovies.slice(10, 15);
  const row4 = popularMovies.slice(15);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo animado de caratulas */}
      {!loading && (
        <div className="absolute inset-0 w-full h-full -z-10">
          {/* Primera fila - deslizamiento hacia la derecha */}
          <div className="absolute h-1/4 w-full overflow-hidden top-0">
            <div className="poster-row animate-slide-right">
              {/* Repetimos las películas lo suficiente para garantizar cobertura */}
              {[...row1, ...row1, ...row1, ...row1].map((movie, index) => (
                <div key={`row1-${movie.id}-${index}`} className="poster-item">
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="h-full object-cover rounded-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Segunda fila - deslizamiento hacia la izquierda */}
          <div className="absolute h-1/4 w-full overflow-hidden top-1/4">
            <div className="poster-row animate-slide-left">
              {[...row2, ...row2, ...row2, ...row2].map((movie, index) => (
                <div key={`row2-${movie.id}-${index}`} className="poster-item">
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="h-full object-cover rounded-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tercera fila - deslizamiento hacia la derecha (más lento) */}
          <div className="absolute h-1/4 w-full overflow-hidden top-1/2">
            <div className="poster-row animate-slide-right-slow">
              {[...row3, ...row3, ...row3, ...row3].map((movie, index) => (
                <div key={`row3-${movie.id}-${index}`} className="poster-item">
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="h-full object-cover rounded-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cuarta fila - deslizamiento hacia la izquierda (más lento) */}
          <div className="absolute h-1/4 w-full overflow-hidden top-3/4">
            <div className="poster-row animate-slide-left-slow">
              {[...row4, ...row4, ...row4, ...row4].map((movie, index) => (
                <div key={`row4-${movie.id}-${index}`} className="poster-item">
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="h-full object-cover rounded-sm"
                  />
                </div>
              ))}
            </div>
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

      {/* Estilos para las filas de posters */}
      <style jsx>{`
        .poster-row {
          display: flex;
          white-space: nowrap;
          height: 100%;
          position: relative;
        }

        .poster-item {
          height: 100%;
          flex-shrink: 0;
          width: 180px;
          padding: 2px;
        }

        /* Animaciones - Velocidades más rápidas para móviles */
        .animate-slide-right {
          animation: slideRight 70s linear infinite;
        }

        .animate-slide-left {
          animation: slideLeft 70s linear infinite;
        }

        .animate-slide-right-slow {
          animation: slideRight 90s linear infinite;
        }

        .animate-slide-left-slow {
          animation: slideLeft 90s linear infinite;
        }

        /* Velocidades optimizadas para pantallas medianas y grandes */
        @media (min-width: 768px) {
          .animate-slide-right {
            animation: slideRight 120s linear infinite;
          }

          .animate-slide-left {
            animation: slideLeft 120s linear infinite;
          }

          .animate-slide-right-slow {
            animation: slideRight 150s linear infinite;
          }

          .animate-slide-left-slow {
            animation: slideLeft 150s linear infinite;
          }
        }

        @keyframes slideRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
