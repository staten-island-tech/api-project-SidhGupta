import "./style.css";
import { DOMSelectors } from "./dom";

const url = "https://api.pokemontcg.io/v2/cards";

// Store all the fetched cards in a global variable for easy filtering
let allCardsData = [];

// Fetch and handle data from the API
async function getData(url, type = '') {
    try {
        let apiUrl = url;

        // If a type is selected, filter the API request by the type
        if (type) {
            apiUrl = `${url}?types=${type}`; // Correct format for types[] query parameter
        }

        console.log('Request URL:', apiUrl);  // Debugging: check if URL is correct

        const response = await fetch(apiUrl);

        // Guard clause for non-200 status
        if (response.status !== 200) {
            throw new Error(`Failed to fetch data, status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Debugging: check what data we got from the API

        // If no data is returned or there are no cards for the selected type, show a message
        if (!data || !data.data || data.data.length === 0) {
            alert('No cards found for the selected type.');
            return;
        }

        // Store the fetched data for filtering
        allCardsData = data.data;
        
        // Display all cards initially or after fetching new data
        displayCards(allCardsData);

        // Create filter buttons after data is fetched
        createRemoveButtons(allCardsData); // Pass the fetched data here to create filter buttons

    } catch (error) {
        console.error(error);
        alert("Sorry, could not find that Pokemon Or you may have to wait a minute for the API to load!");
    }
}

// Create and display cards based on data
function createCards(cards) {
    const cardContainer = DOMSelectors.box;

    // Clear existing cards first to show the new filtered set of cards
    cardContainer.innerHTML = '';

    // Check if no cards were found
    if (cards.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No cards found for this type.";
        cardContainer.appendChild(message);
        return;
    }

    cards.forEach(card => {
        const legalities = card.legalities ? Object.keys(card.legalities).join(", ") : "Unknown";
        const evolvesTo = card.evolvesTo ? card.evolvesTo : "Final Evolution";
        const artist = card.artist ? card.artist : "Unknown"; 

        cardContainer.insertAdjacentHTML('beforeend', `
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

// Function to call createCards and insert it into the container
function displayCards(cards) {
    createCards(cards);   // Pass the fetched cards data to the createCards function
}

// Create filter buttons with the same name, all of which remove the cards
function createRemoveButtons(data) {
    const filterContainer = DOMSelectors.filterContainer;
    filterContainer.innerHTML = '';  // Clear the filter container before adding new buttons

    // List of types, plus "All Cards"
    const types = [
        "All Cards",
        "Fire",
        "Water",
        "Grass",
        "Electric",
        "Psychic",
        "Fighting",
        "Darkness",
        "Dragon",
        "Fairy"
    ];

    // Create a button for each type
    types.forEach(type => {
        const button = document.createElement('button');
        button.textContent = type;
        button.classList.add('p-2', 'bg-red-500', 'text-white', 'rounded', 'hover:bg-red-600');
        
        // Fetch data for the selected type and display cards
        button.addEventListener('click', () => {
            removeCards();  // Clear the cards from the screen
            if (type === "All Cards") {
                // Show all cards
                displayCards(allCardsData);
            } else {
                // Filter and display only the selected type of cards
                const filteredCards = allCardsData.filter(card => card.types && card.types.includes(type));
                displayCards(filteredCards);
            }
        });

        filterContainer.appendChild(button);
    });
}

// Remove all current cards from the page
function removeCards() {
    const cardContainer = DOMSelectors.box;
    cardContainer.innerHTML = '';  // Remove all cards (clear the container)
}

// Show detailed view and hide the normal view
function showDetails(card) {
    const goBackButton = card.querySelector(".go-back-btn");
    const viewButton = card.querySelector(".center-btn");

    // Hide the View Details button and show the Go Back button
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
            c.style.opacity = 0.3;
        } else {
            c.style.opacity = 1;
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

function resetCardView(card) {
    card.style.transform = "scale(1)";
    let allCards = document.querySelectorAll(".card");
    allCards.forEach((card) => card.style.opacity = 1);
    card.style.zIndex = 1;
}

// Initialize data and remove buttons
getData(url); // Fetch all cards initially
