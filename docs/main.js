const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.getElementById("spinner");
let start = 1;
let limit = 8;


function createPokemonCard(pokemon){
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("pokemon-card");
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
    setTimeout(()=>{
        for(let i = start; i <= start + limit; i++) {
            fetchPokemon(i);
        }
    }, "300"); //para probar spinner se pone un timer
    // for(let i = start; i <= start + limit; i++) {
    //     fetchPokemon(i);
    // }
}

fetchPokemons(start, limit);



//PASAR A OTRO ARCHIVO?

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


//PASAR A OTRO ARCHIVO?
const largeCardContainer = document.querySelector(".large-card-container");


function showLargeCard(pokemon){
    largeCardContainer.style.display = "flex";
    previousBtn.classList.add("disabled");
    nextBtn.classList.add("disabled");
    searchInput.disabled = true;
    findButton.disabled = true;
    const largeCard = document.createElement("div");
    largeCard.classList.add("large-card-wrapper");
    largeCard.innerHTML = `<div class="large-card">
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

function getPokemonTypes(pokemon) {
    let types = "";
    if(pokemon.types.length == 1){
        types = `${pokemon.types[0].type.name}`;
    }
    else {
        for(let i=0; i<pokemon.types.length;i++){
            if(i == pokemon.types.length -1) {
                types += `${pokemon.types[i].type.name}`;
            }
            else {
                types += `${pokemon.types[i].type.name}, `;
            }
        }
    }
    return types;
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

//EN OTRO ARCHIVO??

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