import "./style.css";
import { DOMSelectors } from "./dom";

const url = "https://api.pokemontcg.io/v2/cards";
let pokemonData = [];  // Store fetched data for later use in filtering

// Fetch and handle data from the API
async function getData(url) {
    try {
        const response = await fetch(url);

        // Guard clause for non-200 status
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data, status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        pokemonData = data.data;  // Store fetched Pokémon data

        // Update page with response data
        document.querySelector("h1").textContent = "Pokemon Cards";
        displayCards(pokemonData);  // Display all cards initially

        // Set up filter buttons
        setupFilters();

    } catch (error) {
        console.error(error);
        alert("Sorry, could not find that Pokemon Or you may have to wait a minute for the API to load!");
    }
}

// Create and display cards based on data, with an optional type filter
function createCards(cards, filterType = "all") {
    // Filter cards based on selected type
    const filteredCards = filterType === "all" 
        ? cards 
        : cards.filter(card => {
            // Check if the card has a 'types' array and if the first type matches the filter
            return card.types && card.types[0].toLowerCase() === filterType;
        });

    DOMSelectors.box.innerHTML = ''; // Clear existing cards

    filteredCards.forEach(card => {
        const legalities = card.legalities ? Object.keys(card.legalities).join(", ") : "Unknown";
        const evolvesTo = card.evolvesTo ? card.evolvesTo : "Final Evolution";
        const artist = card.artist ? card.artist : "Unknown"; 

        DOMSelectors.box.insertAdjacentHTML('beforeend', `
            <div class="card w-72 bg-blue-500 border-4 border-yellow-500 shadow-xl transform transition-transform hover:scale-105 margin:10px relative flex flex-col justify-between p-4">
                <h1 class="text-2xl font-bold text-yellow-500 text-center mb-4">${card.name}</h1>
                <img src="${card.images.small}" alt="${card.name}" class="w-full h-auto rounded-lg mb-4"> 

                <div class="content">
                    <h3 class="font-bold text-yellow-300 text-center mb-4"> Legality: ${legalities}</h3>
                    <h3 class="font-bold text-yellow-300 text-center mb-4"> Evolves to: ${evolvesTo}</h3>
                    <h3 class="font-bold text-yellow-300 text-center mb-4" hidden> Artist: ${artist}</h3>
                </div>

                <div class="button-container flex justify-center gap-4">
                    <button class="center-btn p-2 bg-yellow-500 text-white rounded-full">
                        View Details
                    </button>
                    <button class="go-back-btn p-2 bg-red-500 text-white rounded-full hidden">
                        Go Back
                    </button>
                </div>
            </div>
        `);
    });

    // Add event listeners to the buttons
    document.querySelectorAll(".center-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            let card = e.target.closest(".card");
            showDetails(card);
        });
    });

    document.querySelectorAll(".go-back-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            let card = e.target.closest(".card");
            hideDetails(card);
        });
    });
}

// Display all cards
function displayCards(cards) {
    createCards(cards, "all");  // Display all cards initially
}

// Show detailed view and hide the normal view
function showDetails(card) {
    const goBackButton = card.querySelector(".go-back-btn");
    const viewButton = card.querySelector(".center-btn");
    const content = card.querySelector(".content");

    viewButton.classList.add("hidden");
    goBackButton.classList.remove("hidden");

    centerCard(card);
    focusedCard(card);
}

// Hide detailed view and show the normal view again
function hideDetails(card) {
    const goBackButton = card.querySelector(".go-back-btn");
    const viewButton = card.querySelector(".center-btn");

    goBackButton.classList.add("hidden");
    viewButton.classList.remove("hidden");

    resetCardView(card);
}

// Center and enlarge the selected card
function centerCard(card) {
    let allCards = document.querySelectorAll(".card");
    allCards.forEach(c => {
        if (c !== card) {
            c.style.opacity = 0.3; // Set opacity to make other cards fade
        } else {
            c.style.opacity = 1; // Ensure the selected card is fully visible
        }
    });
}

function focusedCard(card) {
    let allCards = document.querySelectorAll(".card");
    allCards.forEach(c => {
        if (c === card) {
            c.style.transform = "scale(2)";
            c.style.zIndex = 10;
        } else {
            c.style.transform = "scale(1)";
            c.style.zIndex = 1;
        }
    });
}

// Reset the card view to normal (when going back)
function resetCardView(card) {
    card.style.transform = "scale(1)";
    let allCards = document.querySelectorAll(".card");
    allCards.forEach((card) => card.style.opacity = 1);
    card.style.zIndex = 1;
}

// Setup filter buttons and attach event listeners
function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const type = e.target.textContent.toLowerCase();  // Get the button text (e.g., 'Grass', 'Electric')
            createCards(pokemonData, type); // Pass the type to filter cards
        });
    });
}

// Add the filter buttons to the top of the page
function addFilterButtons() {
    const filterButtonsHTML = `
        <div class="filter-buttons flex justify-center gap-4 my-4">
            <button class="filter-btn p-2 bg-green-500 text-white rounded-full">Grass</button>
            <button class="filter-btn p-2 bg-yellow-500 text-white rounded-full">Electric</button>
            <button class="filter-btn p-2 bg-purple-500 text-white rounded-full">Psychic</button>
            <button class="filter-btn p-2 bg-gray-500 text-white rounded-full">All</button>
        </div>
    `;
    DOMSelectors.box.insertAdjacentHTML('beforebegin', filterButtonsHTML);
}

// Fetch data from the API
getData(url);
addFilterButtons();  // Add filter buttons after fetching the data