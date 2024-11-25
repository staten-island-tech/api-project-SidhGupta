import "./style.css";
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
        const evolvesTo = card.evolvesTo ? card.evolvesTo : "N/A";

        document.querySelector("#container").insertAdjacentHTML('beforeend', `
            <div class="card">
                <h2>${card.name}</h2>
                <img src="${card.images.small}" alt="${card.name}">
                <h3>Legality: ${legalities}</h3>
                <h3>Evolves to: ${evolvesTo}</h3>
            </div>
        `);
    });
}

// Function to call createCards and insert it into the container
function displayCards(data) {
    const container = document.getElementById("container");
    container.innerHTML = ''; // Clear existing cards
    createCards(data.data);   // Pass cards data to the createCards function
}

// Fetch data from the API
getData(url);