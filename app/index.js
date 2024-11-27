import "./style.css";
import { DOMSelectors } from "../dom";
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
        alert("Sorry, could not find that Pokemon!");
    }
}

// Create and display cards based on data
function createCards(cards) {
    cards.forEach(card => {
        const legalities = card.legalities ? Object.keys(card.legalities).join(", ") : "Unknown";
        const evolvesTo = card.evolvesTo ? card.evolvesTo : "Final Evolution";

        DOMSelectors.box.insertAdjacentHTML('beforeend', `
            <div class="card w-72 bg-blue-500 border-4 border-yellow-500 shadow-xl transform transition-transform hover:scale-105 margin:10px relative" data-id="${card.id}">
                <h1 class="text-2xl font-bold text-yellow-500 text-center mb-4">${card.name}</h1>
                <img src="${card.images.small}" alt="${card.name}" class="w-130% h-130% h-auto rounded-lg mb-4"> 
                <button class="center-btn p-2 bg-yellow-500 text-white rounded-full absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    View Details
                </button>
                <h3 class="font-bold text-yellow-300 text-center mb-4"> Legality: ${legalities}</h3>
                <h3 class="font-bold text-yellow-300 text-center mb-4"> Evolves to: ${evolvesTo}</h3>
            </div>
        `);
    });

    // Add event listeners to the buttons
    document.querySelectorAll(".center-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            centerCard(card);
            focusedCard(card )
        });
    });
}

// Function to call createCards and insert it into the container
function displayCards(data) {
    DOMSelectors.innerHTML = ''; // Clear existing cards
    createCards(data.data);   // Pass cards data to the createCards function
}

// Center and enlarge the selected card
function centerCard(card) {
    // Make all other cards opaque
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(c => {
        if (c !== card) {
            c.style.opacity = 0.2;
        } 
    });

}

function focusedCard(card) {
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(c => {
        if (c == card) {
            c.style.scale = 2;
        } 
    });

}



// Fetch data from the API
getData(url);