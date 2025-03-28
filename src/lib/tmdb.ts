const API_KEY = "YOUR_TMDB_API_KEY" // Replace with your actual TMDB API key
const BASE_URL = "https://api.themoviedb.org/3"

export async function searchMovies(query: string) {
  try {
    // For demo purposes, we'll return mock data
    const mockResults = [
      {
        id: 1,
        title: "The Shawshank Redemption",
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        overview:
          "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.",
        release_date: "1994-09-23",
      },
      {
        id: 2,
        title: "The Godfather",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        overview:
          "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
        release_date: "1972-03-14",
      },
      {
        id: 3,
        title: "The Dark Knight",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        overview:
          "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
        release_date: "2008-07-16",
      },
      {
        id: 4,
        title: "Pulp Fiction",
        poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        overview:
          "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
        release_date: "1994-09-10",
      },
      {
        id: 5,
        title: "Fight Club",
        poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        overview:
          "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
        release_date: "1999-10-15",
      },
    ]

    // Filter mock results based on query
    return mockResults.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()))

    // In a real implementation, you would use:
    // const response = await fetch(
    //   `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    // );
    // const data = await response.json();
    // return data.results;
  } catch (error) {
    console.error("Error searching movies:", error)
    throw new Error("Failed to search movies")
  }
}

export async function getMovieDetails(movieId: number) {
  try {
    // For demo purposes, we'll return mock data
    const mockMovies = {
      1: {
        id: 1,
        title: "The Shawshank Redemption",
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        overview:
          "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.",
        release_date: "1994-09-23",
        genres: [
          { id: 18, name: "Drama" },
          { id: 80, name: "Crime" },
        ],
        runtime: 142,
      },
      2: {
        id: 2,
        title: "The Godfather",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        overview:
          "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
        release_date: "1972-03-14",
        genres: [
          { id: 18, name: "Drama" },
          { id: 80, name: "Crime" },
        ],
        runtime: 175,
      },
    }

    return mockMovies[movieId as keyof typeof mockMovies] || null

    // In a real implementation, you would use:
    // const response = await fetch(
    //   `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    // );
    // return await response.json();
  } catch (error) {
    console.error("Error getting movie details:", error)
    throw new Error("Failed to get movie details")
  }
}

