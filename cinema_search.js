const searchForm= document.getElementById("search-form");

const apiKey = "ef47e19e"; // ma clé API OMDb

searchForm.addEventListener("submit", (yz) => {
    yz.preventDefault();
    // Récuperer les données de la page de recherche
    const searchTerm = document.getElementById("input-text").value;
    const yearTerm = document.getElementById("input-year").value;
    const typeTerm = document.getElementById("content-type").value;

    const plotTerm = "short";

    const encodedTitle = encodeURIComponent(searchTerm);

    console.log("Titre recherchée:", searchTerm);
    console.log("Année recherchée:", yearTerm);
    console.log("Format:", typeTerm);
    console.log("Plot:", plotTerm);
    console.log("Encoded:", encodedTitle);

    let apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodedTitle}&type=${typeTerm}`;
    if (yearTerm) {
        apiUrl += `&y=${yearTerm}`;
    }

    console.log("Link:", apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
           if(data.Response === 'True') {
                displaySearchResult(data.Search);
           } else {
                document.getElementById('search-result').innerHTML = `
                <div class="main-poster-container">
                    <div class="main-poster-text">
                        <p>Film non trouvé : ${data.Error}</p>
                    </div>
                </div>
                `
           }
        })
        .catch(error => console.error("Erreur lors de la récupération:", error));
});    

function displaySearchResult (data) {
    const container = document.getElementById('search-result')

    if (!container) {
        console.error("Erreur: Impossible de trouver l'élément .search-result dans le HTML !");
        return;
    }

    let htmlContent = '<div class="main-poster-container">';

    data.forEach(movie => {

        let posterSource = (movie.Poster && movie.Poster !== "N/A")
            ? movie.Poster
            : 'Image_Library/placeholder.png';

        htmlContent += `
            <div class="movie-card">
                <div class="logo-box">
                    <img src="${posterSource}" alt="Film ${movie.Title}" onerror="this.src='Image_Library/placeholder.png'"/>
                </div>
                <div class="main-poster-text">
                    <article>
                        <h3>${movie.Title} (${movie.Year})</h3>
                        <a href="movie.html?id=${movie.imdbID}" class="btn-details">En savoir plus</a>
                    </article>
                </div>
            </div>
            `;
    });

    htmlContent += '</div>';
    container.innerHTML = htmlContent;
}    