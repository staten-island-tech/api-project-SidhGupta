import "./style.css"
const url = "https://api.pokemontcg.io/v2/cards"



async function getData(url){
    //fetch returns a promise 
    try {
        const response = await fetch(url);
        // gaurd clause

        if(response.status != 200){
            throw new Error(response);
    } else {
        const data = await response.json();
        console.log(data);
        document.querySelector("h1").textContent = data.data;
        displayCards(data);
    }
}   catch (error) {
        console.log(error);
        alert("sorry could not find that Poket Monster")
    }
}



function createCards(data) {
    
    // Loop through each card in the data and create an HTML card for each
    cards.forEach(card => {
        document.querySelector(".container").insertAdjacentHTML('beforeend', `
            <div class="card">
                <h2>${card.name}</h2>
                <img src="${card.images.small}" alt="${card.name}">
                <h3>Legality: ${card.legalities}</h3>
                <h3>Evolves to: ${card.evolvesTo ? card.evolvesTo : "N/A"}</h3>
            </div>
        `);
    });
}

function displayCards(data) {
    const container = document.getElementById("container")
    container.innerHTML = createCards(data);
}

getData(url);