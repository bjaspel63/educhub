let websites = [];

const container = document.getElementById("container");
const search = document.getElementById("search");
const category = document.getElementById("category");
const themeBtn = document.getElementById("themeBtn");

fetch("websites.json")
    .then(response => response.json())
    .then(data => {
        websites = data;
        applyFilters();
    });

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function display(sites) {

    container.innerHTML = "";

    const favorites = getFavorites();

    // ⭐ Show empty state for Favorites filter
    if (category.value === "Favorites" && sites.length === 0) {
        container.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px;
                font-size: 20px;
                color: gray;
            ">
                ⭐ You don’t have any favorites yet!
            </div>
        `;
        return;
    }

    sites.forEach(site => {

        const isFav = favorites.includes(site.name);

        container.innerHTML += `
        <div class="card" style="border-top:10px solid ${site.color}">

            <div class="favorite"
                 onclick="toggleFavorite('${site.name.replace(/'/g, "\\'")}')">
                ${isFav ? "⭐" : "☆"}
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

    let favorites = getFavorites();

    if (favorites.includes(name)) {
        favorites = favorites.filter(x => x !== name);
    } else {
        favorites.push(name);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    applyFilters();
}

function applyFilters() {

    let text = search.value.toLowerCase();
    let cat = category.value;
    let favorites = getFavorites();

    let filtered = websites.filter(site => {

        const matchesSearch =
            site.name.toLowerCase().includes(text) ||
            site.subject.toLowerCase().includes(text);

        const matchesCategory =
            cat === "All" ||
            site.subject === cat ||
            (cat === "Favorites" && favorites.includes(site.name));

        return matchesSearch && matchesCategory;
    });

    display(filtered);
}

// Search
search.addEventListener("input", applyFilters);

// Category
category.addEventListener("change", applyFilters);

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
