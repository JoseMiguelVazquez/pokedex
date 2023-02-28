const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.getElementById("spinner");
let start = 1;
let limit = 8;


function createPokemonCard(pokemon){
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("pokemon-card");
    cardDiv.classList.add("shadow-pop-bl");
    cardDiv.onclick = () => {showLargeCard(pokemon);};

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("img-container");

    const pokemonImage = document.createElement("img");
    pokemonImage.src = pokemon.sprites.front_default;

    imageContainer.appendChild(pokemonImage);

    const pokemonName = document.createElement("p");
    pokemonName.classList.add("pokemon-name");
    pokemonName.textContent = pokemon.name;

    const pokemonNumber = document.createElement("p");
    pokemonNumber.textContent = `No: ${pokemon.id}`;
    // pokemonNumber.textContent = `#${pokemon.id.toString().padStart(3,0)}`;

    cardDiv.append(imageContainer, pokemonName, pokemonNumber);
    pokemonContainer.appendChild(cardDiv);
}

function fetchPokemon(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then(response => response.json())
    .then(stats => createPokemonCard(stats));
    spinner.style.display = "none";
}

function fetchPokemons(start, limit) {
    spinner.style.display = "block";
    let i = start;
    setTimeout(()=>{
        let counter = setInterval(()=>{
            if(i <= start + limit){
                fetchPokemon(i);
                i++;
            }
            else{
                clearInterval(counter);
            }
        },5);
    },300);
    
    // setTimeout(()=>{
    //     for(let i = start; i <= start + limit; i++) {
    //         fetchPokemon(i);
    //     }
    // }, "300");
    //para probar spinner se pone un timer
    // for(let i = start; i <= start + limit; i++) {
    //     fetchPokemon(i);
    // }
}

fetchPokemons(start, limit);



//PAGINATION (OTRO ARCHIVO?)

const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");

function removeChilds(parent){
    while(parent.hasChildNodes()){
        parent.removeChild(parent.lastChild);
    }
}

previousBtn.addEventListener("click", ()=>{
    if(start != 1){
        removeChilds(pokemonContainer);
        start -= limit + 1;
        fetchPokemons(start, limit);
    }
});

nextBtn.addEventListener("click", ()=>{
    //agregar el max num de pokemons y no deje hacer next
    removeChilds(pokemonContainer);
    start += limit + 1;
    fetchPokemons(start, limit);
});


//SHOW LARGE CARD (OTRO ARCHIVO?)
const largeCardContainer = document.querySelector(".large-card-container");


function showLargeCard(pokemon){
    largeCardContainer.style.display = "flex";
    previousBtn.disabled = true;
    nextBtn.disabled = true;
    searchInput.disabled = true;
    findButton.disabled = true;
    const largeCard = document.createElement("div");
    largeCard.classList.add("large-card-wrapper");
    largeCard.innerHTML = `<div class="large-card scale-in-center">
                                <div class="close-card" onclick="closeLargeCard()">X</div>
                                <div class="large-card-img-container">
                                    <img src=${pokemon.sprites.other["official-artwork"].front_default}>
                                    <p>Normal</p>
                                    <img src=${pokemon.sprites.other["official-artwork"].front_shiny}>
                                    <p>Shiny</p>
                                </div>
                                <div class="large-card-info">
                                    <p class="large-card-pokemon-name">${pokemon.name}</p>
                                    <p><b>Type(s):</b> ${getPokemonTypes(pokemon)}</p>
                                    <p><b>Abilities:</b> ${getPokemonAbilities(pokemon)}</p>
                                    <p><b>Height:</b> ${(pokemon.height*0.1).toFixed(2)} m</p>
                                    <p><b>Weight:</b> ${(pokemon.weight*0.1).toFixed(2)} kg</p>
                                </div>
                            </div>`;
    largeCardContainer.appendChild(largeCard);
}

const badgeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#B279DF',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#87B7BE',
    fighting: '#E37D5D',
    default: '#2A1A1F',
};



function getPokemonTypes(pokemon) {
    let types = document.createElement("span");
    for(let i=0; i<pokemon.types.length;i++){
        let badge = document.createElement("span");
        badge.classList.add("badge");
        let typeText = pokemon.types[i].type.name;
        badge.textContent = `${typeText}`;
        types.appendChild(badge);
        badge.style.background = badgeColors[typeText];
    }
    return types.innerHTML;
}


function getPokemonAbilities(pokemon) {
    let abilities = "";
    if(pokemon.abilities.length == 1){
        abilities = `${pokemon.abilities[0].ability.name}`;
    }
    else {
        for(let i=0; i<pokemon.abilities.length;i++){
            if(i == pokemon.abilities.length -1) {
                abilities += `${pokemon.abilities[i].ability.name}`;
            }
            else {
                abilities += `${pokemon.abilities[i].ability.name}, `;
            }
        }
    }
    return abilities;
}

function closeLargeCard(){
    largeCardContainer.style.display = "none";
    previousBtn.classList.remove("disabled");
    nextBtn.classList.remove("disabled");
    searchInput.disabled = false;
    findButton.disabled = false;
    removeChilds(largeCardContainer);
}

//SEARCH POKEMON (OTRO ARCHIVO?)

const searchInput = document.getElementById("search-pokemon-input");
const findButton = document.getElementById("find-pokemon-button");

function findPokemon(event) {
    event.preventDefault();
    if(searchInput.value == ""){
        alert("Write a Pokemon Name to Search For");
    }
    else{
        fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput.value.toLowerCase()}/`)
        .then((response) => {
            if (response.ok){
                return response.json();
            }
            alert("Pokemon Not Found");
            throw new Error("Something went wrong");
        })
        .then(pokemon => showLargeCard(pokemon))
        .catch((error) => {
            console.log(error)
        });
    }
}



