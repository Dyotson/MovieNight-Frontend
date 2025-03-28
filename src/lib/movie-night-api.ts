const API_BASE_URL = "https://movie-night-backend-zeta.vercel.app/api";

// Interfaz para MovieNight
export interface MovieNight {
  id: number;
  name: string;
  token: string;
  date: string;
  maxProposals: number | null;
  maxVotesPerUser: number | null;
  inviteLink: string;
  movies: MovieProposal[];
}

// Interfaz para MovieProposal
export interface MovieProposal {
  id: number;
  tmdbId: number;
  title: string;
  posterPath: string;
  overview?: string;
  releaseDate?: string;
  votes: number;
  proposedBy: string;
  votersList?: string[];
}

// Interfaz para User
export interface User {
  username: string;
  votedFor?: number[];
  votesRemaining: number | null;
}

// Interfaz para Stats
export interface MovieNightStats {
  totalUsers: number;
  usersVoted: number;
  totalVotes: number;
  averageVotesPerUser: string;
  percentUsersVoted: number;
  topMovies: {
    title: string;
    votes: number;
    percentOfUsers: number;
  }[];
  maxVotesPerUser: number | null;
  movieNightEndsIn: number;
}

// 1. Crear una nueva sesión
export async function createMovieNight(data: {
  name: string;
  date: string;
  maxProposals?: number;
  maxVotesPerUser?: number;
  username?: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/nights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear la sesión");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating movie night:", error);
    throw error;
  }
}

// 2. Unirse a una sesión existente
export async function joinMovieNight(token: string, username: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/nights/${token}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al unirse a la sesión");
    }

    return await response.json();
  } catch (error) {
    console.error("Error joining movie night:", error);
    throw error;
  }
}

// 3. Obtener información de una sesión
export async function getMovieNight(token: string, username?: string) {
  try {
    const url = username
      ? `${API_BASE_URL}/nights/${token}?username=${encodeURIComponent(
          username
        )}`
      : `${API_BASE_URL}/nights/${token}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener la sesión");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting movie night:", error);
    throw error;
  }
}

// 4. Proponer una película
export async function proposeMovie(
  token: string,
  data: {
    movie: {
      tmdbId: number;
      title: string;
      poster_path: string;
      overview?: string;
      release_date?: string;
    };
    proposedBy: string;
  }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/nights/${token}/propose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al proponer la película");
    }

    return await response.json();
  } catch (error) {
    console.error("Error proposing movie:", error);
    throw error;
  }
}

// 5. Votar por una película
export async function voteForMovie(
  token: string,
  tmdbId: number,
  username: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/nights/${token}/vote/${tmdbId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al votar por la película");
    }

    return await response.json();
  } catch (error) {
    console.error("Error voting for movie:", error);
    throw error;
  }
}

// 6. Obtener usuarios de una sesión
export async function getMovieNightUsers(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/nights/${token}/users`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener los usuarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting movie night users:", error);
    throw error;
  }
}

// 7. Obtener estadísticas de votación
export async function getMovieNightStats(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/nights/${token}/stats`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las estadísticas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting movie night stats:", error);
    throw error;
  }
}
