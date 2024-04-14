let container = document.querySelector(".pokemons");
let selectPage = document.querySelector("#limit");
let navigation = document.querySelector(".navigation .numbers");

const searchInput = document.getElementById("search");
const pokedexContainer = document.getElementById("pokedex");

let pokemons = [];
const pokeUrl = "https://pokeapi.co/api/v2/";
let prevLink = "";
let nextLink = "";
let count = 0;
let perPage = 40;
let currentPage = 0;

const changePg = (value) => {
    //console.log("value: ", value);
    let newUrl = `${pokeUrl}pokemon?limit=${value}`;
    perPage = value;
    getPokemons(newUrl);
}
const prev = () => {
    getPokemons(prevLink);
}
const next = () => {
    getPokemons(nextLink);
}

const getPokemons = (url) => {
    let params = new URLSearchParams(url.split('?')[1]);
    let offset = params.get('offset');
    currentPage = offset / perPage;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            prevLink = responseJson.previous;
            nextLink = responseJson.next;
            count = responseJson.count;
            addNumbers(count);
            showPokemons(responseJson.results);
        })
}

const showPokemons = (array) => {
    clearContainer();
    array.map(item => {
        fetch(item.url)
            .then(response => response.json())
            .then(data => {
                //console.log("data: ", data)
                loadCard(data);
            })
    })
}
const loadCard = (data) => {
    const image = data.sprites.other.home.front_default;
    let newImage = image ? image : '/images/default.png';
    let card = document.createElement("div"); 
    let content = `
        <img src="${newImage}" alt="${data.name}">
        <p>${data.name}</p>
        <p class="order"> #${data.order}</p>
    `;
    card.innerHTML = content;
    container.appendChild(card);
}

const clearContainer = () =>  container.innerHTML = "";
const clearNavigation = () => navigation.innerHTML="";

const addNumbers = (count) => {
    clearNavigation();
    const pages = count/perPage;
    for (let index = 0; index < pages; index++) {
        let number = document.createElement("span");
        number.classList.add(`element-${index}`);
        const numLink = `<button onclick="actionNumber(${index})">${index+1}</button>`
        number.innerHTML = numLink;
        navigation.appendChild(number);
    }
    addFocusClass();
}
const actionNumber = (index) => {
    const newUrl = `${POKE_URL}?offset=${index*perPage}&limit=${perPage}`;
    getPokemons(newUrl);
    
}
const addFocusClass = () => {
    const span = document.querySelector(`.element-${currentPage}`);
    span.classList.add("current");
}

function showError(msg){
    pokedexContainer.innerHTML = `<p>${msg}</p>`
}


async function searchPokemon() {

    const searchedPokemon = searchInput.value.toLowerCase();

    try{

        const response = await fetch(URL + searchedPokemon)
        
        if(!response.ok) {
            showError(`No existe un pokemon llamado: ${searchedPokemon}`);
            return;
        }
        const data = await response.json();


        pokedexContainer.innerHTML = 
        `
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${data.sprites.front_default} ">
        <p>Numero: ${data.id}</p>
        <p>Altura: ${data.height / 10}m</p>
        <p>Peso: ${data.weight / 10}kg</p>
        `
    } catch (error) {
        console.log(error);
        showError('Se ha generado un  error en la busqueda')

    }
}


getPokemons(`${pokeUrl}pokemon?offset=0&limit=40`);