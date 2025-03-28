const API_BASE_URL = "https://movie-night-backend-zeta.vercel.app/api";

export async function searchMovies(query: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la búsqueda de películas");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw new Error("Failed to search movies");
  }
}

export async function getMovieDetails(movieId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener detalles de la película"
      );
    }

    const data = await response.json();
    return data.movie;
  } catch (error) {
    console.error("Error getting movie details:", error);
    throw new Error("Failed to get movie details");
  }
}

export async function getPopularMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/popular`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener películas populares"
      );
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error getting popular movies:", error);
    throw new Error("Failed to get popular movies");
  }
}

export async function getCachedMovies(limit = 20, sort = "popularity") {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movies/cached?limit=${limit}&sort=${sort}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener películas en caché"
      );
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error getting cached movies:", error);
    throw new Error("Failed to get cached movies");
  }
}
