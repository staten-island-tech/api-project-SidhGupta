const URL =   " https://api.pokemontcg.io/v2/cards?q=name:gardevoir"


async function getData(){
    //fetch returns a promise 
    try {
        const response = await fetch("URL");
        // gaurd clause

        if(response.status != 200){
            throw new Error(response);
    } else {
        const data = await response.json();
        console.log(response);
        document.querySelector("h1").textContent = data.name;
    }
}   catch (error) {

        console.log(error);
        alert("sory could not find that Poket Moster")
    }

    
    const data = await response.json();
    console.log(data);
}

getData(URL);
    // gaurd clause);