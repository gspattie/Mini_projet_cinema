// Récupération de l'ID du film depuis l'URL

const urlParams = new URLSearchParams(window.location.search);
const movieID = urlParams.get("id");

const apiKey = "ef47e19e"; // ma clé API OMDb

async function loadMovieDetails() {
        if (!movieID) {
            console.error("Aucun ID de film retrouvé dans l'URL.");
            document.getElementById("movie-title").textContent = "Aucun film sélectionné.";
            document.getElementById("movie-plot").textContent = "Veuillez retourner à la page d'accueil ou utiliser la recherche pour choisir un film à afficher ici.";
            //cacher le meta description
            document.getElementById("movie-director").textContent = "";
            document.getElementById("movie-actors").textContent = "";
            document.getElementById("movie-genre").textContent = "";
            document.getElementById("movie-year").textContent = "";
            document.getElementById("movie-rating").textContent = "";
            // cacher le poster
            document.getElementById("movie-poster").alt = "Veuillez choisir un film.";
            return;
        }

        try {
            // Récupération du film spécifique en utilisant l'ID et avec un plot complet
            const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}&plot=full`;
            const response = await fetch(apiUrl);
            const movie = await response.json();
            
            if (movie.Response === "True") {
                // Affichage des détails du film dans la page
                document.getElementById("movie-title").textContent = movie.Title;
                document.getElementById("movie-poster").src = movie.Poster !== "N/A" ? movie.Poster : "Image_Library/placeholder.png";
                document.getElementById("movie-plot").textContent = movie.Plot;
                document.getElementById("movie-director").textContent = `Réalisateur: ${movie.Director}`;
                document.getElementById("movie-actors").textContent = `Acteurs: ${movie.Actors}`;
                document.getElementById("movie-genre").textContent = `Genre: ${movie.Genre}`;
                document.getElementById("movie-year").textContent = `Année: ${movie.Year}`;

                const rtObj = movie.Ratings ? movie.Ratings.find(r => r.Source === "Rotten Tomatoes") : null;
                const rtScore = rtObj ? rtObj.Value : "Non Disponible";

                const mcObj = movie.Ratings ? movie.Ratings.find(m => m.Source === "Metacritic") : null;
                const mcScore = mcObj ? mcObj.Value : "Non Disponible";
                document.getElementById("movie-ratings").textContent = `Note IMDb: ${movie.imdbRating} | Rotten Tomatoes: ${rtScore} | Metacritic: ${mcScore}`;
                
                const dvdDateElement = document.getElementById("movie-dvd");
                if (dvdDateElement) {
                    if (movie.DVD && movie.DVD !== "N/A") {
                        const formattedDate = new Date(movie.DVD).toLocaleDateString("fr-FR");
                        dvdDateElement.textContent = `Date de sortie sur DVD : ${formattedDate}`;
                    } else {
                        dvdDateElement.textContent = "Date de sortie sur DVD : Non disponible";
                    }
                }
                
        } else {
                console.log("Erreur lors de la récupération des détails du film:", movie.Error);
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
        }
    }

loadMovieDetails();    