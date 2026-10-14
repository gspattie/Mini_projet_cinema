let isLoading = false;
let currentPage = 1;

const apiKey = "ef47e19e"; // ma clé API OMDb
const searchQuery = "action"; // exemple de recherche

const loadingIndicator = document.getElementById("loading-message");
const container = document.getElementById("extra-films-container");
const loadBtn = document.getElementById("load-more-btn");

async function loadMoreFilms() {
        if (isLoading) {
            console.warn("Chargement déjà en cours. Veuillez patienter.");
            return;
        }

        isLoading = true;
        if (loadingIndicator) {
            loadingIndicator.classList.remove("hidden");
        }

        // --- TEMPORARY TEST DELAY ---
        await new Promise(resolve => setTimeout(resolve, 3000));
        // ----------------------------

        try {
            const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}&type=movie&page=${currentPage}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.Response === "True") {
                let rowIndex = 0;

                for (let i =0; i < data.Search.length; i += 2) {
                    const movie1 = data.Search[i];
                    const movie2 = data.Search[i + 1];

                    if (!movie1) continue;

                    const newRow = document.createElement("div");
                    newRow.classList.add("main-poster-container");

                    const poster1 = movie1.Poster !== "N/A" ? movie1.Poster : "Image_Library/placeholder.jpg";
                    const poster2 = movie2 && movie2.Poster !== "N/A" ? movie2.Poster : "Image_Library/placeholder.jpg";
                
                    if (rowIndex % 2 === 0) {
                        let rowHTML = `
                            <div class="logo-box">
                                <img src="${poster1}" alt="Film ${movie1.Title}" onerror="this.src='Image_Library/placeholder.jpg'"/>
                            </div>
                            <div class="main-poster-text">
                                <article>
                                    <h3>${movie1.Title}</h3>
                                    <p>Description du film bidon left.</p>
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
                                    <p>Description du film bidon right.</p>
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
                                    <p>Description du film bidon left.</p>
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
                                    <p>Description du film bidon right.</p>
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

if (loadBtn) {
    loadBtn.addEventListener("click", loadMoreFilms);
}