let websites = [];

const container = document.getElementById("container");
const search = document.getElementById("search");
const category = document.getElementById("category");
const themeBtn = document.getElementById("themeBtn");
const favoritesOnly = document.getElementById("favoritesOnly");

fetch("websites.json")
    .then(response => response.json())
    .then(data => {
        websites = data;
        applyFilters();
    });

function display(sites) {

    container.innerHTML = "";

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    sites.forEach(site => {

        container.innerHTML += `
        <div class="card" style="border-top:10px solid ${site.color}">

            <div class="favorite"
                 onclick="toggleFavorite('${site.name}')">
                ${favorites.includes(site.name) ? "⭐" : "☆"}
            </div>

            <img class="thumbnail"
                 src="${site.thumbnail}"
                 alt="${site.name}">

            <div class="content">

                <h2>${site.icon} ${site.name}</h2>

                <p>${site.description}</p>

                <div class="grades">
                    ${site.grade
                        .map(g => `<span class="grade">${g}</span>`)
                        .join("")}
                </div>

                <button class="visit-btn"
                    onclick="window.open('${site.link}','_blank')">
                    🚀 Visit Website
                </button>

            </div>

        </div>
        `;
    });

}


function toggleFavorite(name) {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(name)) {
        favorites = favorites.filter(x => x !== name);
    }
    else {
        favorites.push(name);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    applyFilters();
}


function applyFilters() {

    let text = search.value.toLowerCase();
    let cat = category.value;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    let filtered = websites.filter(site => {

        let matchesSearch =
            site.name.toLowerCase().includes(text) ||
            site.subject.toLowerCase().includes(text);

        let matchesCategory =
            cat === "All" || site.subject === cat;

        let matchesFavorite =
            !favoritesOnly.checked ||
            favorites.includes(site.name);

        return matchesSearch &&
               matchesCategory &&
               matchesFavorite;

    });

    display(filtered);
}


// Search
search.addEventListener("input", applyFilters);

// Category
category.addEventListener("change", applyFilters);

// Favorites Only
favoritesOnly.addEventListener("change", applyFilters);


// Dark Mode
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );

});


// Restore Theme
if (localStorage.getItem("theme") === "true") {
    document.body.classList.add("dark");
}
