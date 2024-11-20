const url = "https://api.pokemontcg.io/v2/cards"
import "./style.css"
async function getData(){
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
    }
}   catch (error) {

        console.log(error);
        alert("sorry could not find that Poket Moster")
    }
}

getData();
    // gaurd clause);