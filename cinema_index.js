let isLoading = false;
let currentPage = 1;

const apiKey = "ef47e19e"; // ma clé API OMDb
const searchQuery = "love"; // exemple de recherche

const loadingIndicator = document.getElementById("loading-message");
const container = document.getElementById("extra-films-container");
const loadBtn = document.getElementById("load-more-btn");

// Array de films pour les "films de la semaine"
const featuredMovies = [
    "tt33764258", // The Odyssey
    "tt12042730", // Project Hail Mary
    "tt28535715", // Whalefall
    "tt29355505", // Toy Story 5
];

async function loadFeaturedMovies() {
    const featuredContainer = document.getElementById("featured-movies-container");
    if (!featuredContainer) return;

    // Fonction pour récuperer un seul film et retourner ses données
    async function fetchMovieData(id) {
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=short`);
            const movie = await res.json();
            if (movie.Response === "True") {
                return {
                    title: movie.Title,
                    year: movie.Year,
                    poster: movie.Poster !== "N/A" ? movie.Poster : "Image_Library/placeholder.jpg",
                    plot: movie.Plot !== "N/A" ? movie.Plot : "Description du film non disponible",
                    id: movie.imdbID
                };
            }
        } catch (error) {
            console.error(`Erreur 3 pour le film ${id}`, error)
        }
        return null;
    }

    const odyssey = await fetchMovieData(featuredMovies[0]);
    const hailMary = await fetchMovieData(featuredMovies[1]);
    const whalefall = await fetchMovieData(featuredMovies[2]);
    const toyStory = await fetchMovieData(featuredMovies[3]);

    let htmlContent = "";

    if (odyssey) {
        htmlContent += `
            <div class="main-poster-container">
                <div class="logo-box">
                    <img src="${odyssey.poster}" alt="${odyssey.title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                </div>
                <div class="main-poster-text">
                    <article>
                        <h3 class="extra-bold">${odyssey.title} (${odyssey.year})</h3>
                        <p>${odyssey.plot}</p>
                        <a href="movie.html?id=${odyssey.id}" class="btn-details">En savoir plus</a>
                    </article>
                </div>
            </div>    
        `;
    }

    if (hailMary && whalefall) {
        htmlContent += `
            <h3 class="section-subtitle">Aussi à l'affiche cette semaine</h3>
            <div class="main-poster-container">
                <div class="logo-box">
                    <img src="${hailMary.poster}" alt="${hailMary.title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                </div>
                <div class="main-poster-text">
                    <article>
                        <h3 class="extra-bold">${hailMary.title} (${hailMary.year})</h3>
                        <p>${hailMary.plot}</p>
                        <a href="movie.html?id=${hailMary.id}" class="btn-details">En savoir plus</a>
                    </article>
                </div>
                <div class="logo-box">
                    <img src="${whalefall.poster}" alt="${whalefall.title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                </div>
                <div class="main-poster-text">
                    <article>
                        <h3 class="extra-bold">${whalefall.title} (${whalefall.year})</h3>
                        <p>${whalefall.plot}</p>
                        <a href="movie.html?id=${whalefall.id}" class="btn-details">En savoir plus</a>
                    </article>
                </div>
            </div>  
        `;
    }
    
    if (toyStory) {
        htmlContent += `
            <div class="section-subtitle">
                <h3>Spéciale Famille - Vacances de la Toussaint</h3>
                <p>Avoue, c'est plus temptant qu'une deuxième cimietière sous la pluie</p>
            </div>    
            <div class="main-poster-container">
                <div class="logo-box">
                    <img src="${toyStory.poster}" alt="${toyStory.title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                </div>
                <div class="main-poster-text">
                    <article>
                        <h3 class="extra-bold">${toyStory.title} (${toyStory.year})</h3>
                        <p>${toyStory.plot}</p>
                        <a href="movie.html?id=${toyStory.id}" class="btn-details">En savoir plus</a>
                    </article>
                </div>
            </div>    
        `;
    }

    featuredContainer.innerHTML = htmlContent;

}

async function loadMoreFilms() {
    if(isLoading) return;
    isLoading = true;

    if (loadingIndicator) {
        loadingIndicator.classList.remove("hidden");
    }

    // --- TEMPORARY TEST DELAY ---
    await new Promise(resolve => setTimeout(resolve, 3000));
    // ----------------------------

        try {
            const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}&y=2025&type=movie&page=${currentPage}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.Response === "True") {
                let rowIndex = 0;

                for (let i =0; i < data.Search.length; i += 2) {
                    const movie1 = data.Search[i];
                    const movie2 = data.Search[i + 1];

                    console.log("Movie 1:", movie1); // Log pour vérifier le premier film
                    if (movie2) {
                        console.log("Movie 2:", movie2); // Log pour vérifier le deuxième film
                    }

                    if (!movie1) continue;

                    const newRow = document.createElement("div");
                    newRow.classList.add("main-poster-container");

                    const poster1 = movie1.Poster !== "N/A" ? movie1.Poster : "Image_Library/placeholder.jpg";
                    const poster2 = movie2 && movie2.Poster !== "N/A" ? movie2.Poster : "Image_Library/placeholder.jpg";

                    const plotUrl1 = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie1.imdbID}&plot=short`;
                    const plotUrl2 = movie2 ? `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie2.imdbID}&plot=short` : null;

                    const plotResponse1 = await fetch(plotUrl1);
                    const plotData1 = await plotResponse1.json();
                    const plot1 = plotData1.Plot !== "N/A" ? plotData1.Plot : "Description du film non disponible.";

                    const plotResponse2 = movie2 ? await fetch(plotUrl2) : null;
                    const plotData2 = movie2 && plotResponse2 ? await plotResponse2.json() : null;
                    const plot2 = movie2 && plotData2 ? (plotData2.Plot !== "N/A" ? plotData2.Plot : "Description du film non disponible.") : null;
                
                    if (rowIndex % 2 === 0) {
                        let rowHTML = `
                            <div class="logo-box">
                                <img src="${poster1}" alt="Film ${movie1.Title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                            </div>
                            <div class="main-poster-text">
                                <article>
                                    <h3>${movie1.Title}</h3>
                                    <p>${plot1}</p>
                                    <a href="movie.html?id=${movie1.imdbID}" class="btn-details">En savoir plus</a>
                                </article>
                            </div>
                        `;

                    if (movie2) {
                        rowHTML += `
                            <div class="logo-box">
                                <img src="${poster2}" alt="Film ${movie2.Title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                            </div>
                            <div class="main-poster-text">
                                <article>
                                    <h3>${movie2.Title}</h3>
                                    <p>${plot2}</p>
                                    <a href="movie.html?id=${movie2.imdbID}" class="btn-details">En savoir plus</a>
                                </article>
                            </div>
                        `;
                    }
                    newRow.innerHTML = rowHTML;
                } else {
                        let rowHTML = `
                            <div class="main-poster-text">
                                <article>
                                    <h3>${movie1.Title}</h3>
                                    <p>${plot1}</p>
                                    <a href="movie.html?id=${movie1.imdbID}" class="btn-details">En savoir plus</a>
                                </article>
                            </div>
                            <div class="logo-box">
                                <img src="${poster1}" alt="Film ${movie1.Title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                            </div>
                        `;

                    if (movie2) {
                        rowHTML += `
                            <div class="main-poster-text">
                                <article>
                                    <h3>${movie2.Title}</h3>
                                    <p>${plot2}</p>
                                    <a href="movie.html?id=${movie2.imdbID}" class="btn-details">En savoir plus</a>
                                </article>
                            </div>
                            <div class="logo-box">
                                <img src="${poster2}" alt="Film ${movie2.Title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                            </div>
                        `;
                    }
                    newRow.innerHTML = rowHTML;
                }
                container.appendChild(newRow);
                rowIndex++;
            }

            currentPage++;
        } else {
            console.log("No more movies found");
        }
    } catch (error) {
        console.error("Erreur lors du chargement des films:", error);
    } finally {
            if (loadingIndicator) {
                loadingIndicator.classList.add("hidden");
            }
            isLoading = false;
    }
}

// Appel de la fonction pour charger  les films de la semaine
document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedMovies();

    if (loadBtn) {
        loadBtn.addEventListener("click", loadMoreFilms);
    }
});