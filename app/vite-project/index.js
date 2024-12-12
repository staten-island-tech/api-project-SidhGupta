import "./style.css";
import { DOMSelectors } from "./dom";

const url = "https://api.pokemontcg.io/v2/cards";

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

        // Update page with response data
        document.querySelector("h1").textContent = "Pokemon Cards";
        displayCards(data);
    } catch (error) {
        console.error(error);
        alert("Sorry, could not find that Pokemon Or you may have to wait a minute for the API to load!");
    }
}

// Create and display cards based on data
function createCards(cards) {
    cards.forEach(card => {
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
                    <h3 class="font-bold text-yellow-300 text-center mb-4 artist-info hidden"> Artist: ${artist}</h3>
                </div>

                <!-- Buttons are inside a container for proper spacing -->
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

    // Add event listeners to the "Go Back" buttons
    document.querySelectorAll(".go-back-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            let card = e.target.closest(".card");
            hideDetails(card);
        });
    });
}

// Function to call createCards and insert it into the container
function displayCards(data) {
    DOMSelectors.innerHTML = ''; // Clear existing cards
    createCards(data.data);   // Pass cards data to the createCards function
}

// Show detailed view and hide the normal view
function showDetails(card) {
    const goBackButton = card.querySelector(".go-back-btn");
    const viewButton = card.querySelector(".center-btn");
    const content = card.querySelector(".content");

    // Show detailed view content (unhide the artist)
    content.querySelector(".artist-info").classList.remove("hidden");

    // Hide the View Details button and show the Go Back button
    viewButton.classList.add("hidden");
    goBackButton.classList.remove("hidden");

    // Optionally, enlarge the card and show detailed info (this is done in the focusedCard function)
    centerCard(card);
    focusedCard(card);
}

// Hide detailed view and show the normal view again
function hideDetails(card) {
    const goBackButton = card.querySelector(".go-back-btn");
    const viewButton = card.querySelector(".center-btn");
    const content = card.querySelector(".content");

    // Hide the Go Back button and show the View Details button
    goBackButton.classList.add("hidden");
    viewButton.classList.remove("hidden");

    // Hide detailed content and show the basic details
    content.querySelector(".artist-info").classList.add("hidden");

    // Reset the card view (scale, opacity)
    resetCardView(card);
}

// Center and enlarge the selected card
function centerCard(card) {
    // Make all other cards opaque
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
            c.style.transform = "scale(2)"; // Correct way to apply scaling with transform
            c.style.zIndex = 10; // Optional: make sure the focused card is above others
        } else {
            c.style.transform = "scale(1)"; // Reset scale for other cards
            c.style.zIndex = 1; // Reset the z-index for other cards
        }
    });
}

// Reset the card view to normal (when going back)
function resetCardView(card) {
    card.style.transform = "scale(1)"; // Reset card scale
    let allCards = document.querySelectorAll(".card");
    allCards.forEach((card) => card.style.opacity = 1); // Reset opacity to full visibility
    card.style.zIndex = 1; // Reset z-index
}

// Fetch data from the API
getData(url);