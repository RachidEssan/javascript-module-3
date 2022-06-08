// fetch function

async function makeRequest(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("something went wrong..", error);
  }
}

// resolve array of promises

async function resolvePromises(arrayOfURLS) {
  const resolvedPromises = await Promise.all(arrayOfURLS.map(arrayOfPromises =>
    makeRequest(arrayOfPromises)
  ))
  return resolvedPromises
}

// create root elements  

const root = document.querySelector("#root")
const header = document.createElement("header")
const sideBar = document.createElement("div")
const mainArea = document.createElement("div")
const displayBox = document.createElement("div")
const titleBox = document.createElement("div")
const loadBtn = document.createElement("button")
sideBar.classList.add("side-bar")
mainArea.classList.add('main-area')
displayBox.classList.add("display-box")
titleBox.classList.add("title-box")
loadBtn.classList.add("load-more-btn")
loadBtn.innerText = "Load more"
root.appendChild(sideBar)

// generate episode list

async function episodeList(url) {
  const episodes = await makeRequest(url)

  episodes.results.forEach(({episode, id, name, characters, air_date}) => {
    const episodeNumber = document.createElement("a")

    episodeNumber.classList.add("episode")
    episodeNumber.innerText = `Episode ${id}`

    sideBar.appendChild(episodeNumber)
    sideBar.appendChild(loadBtn)

    episodeNumber.addEventListener("click", () => {
      showCharacters(name, air_date, episode, characters)
    })
  })
}
episodeList("https://rickandmortyapi.com/api/episode?page=1")


// load more episodes button

function loadMoreEpisodes() {
  let page = 1
  loadBtn.addEventListener("click", () => {
    page += 1
    episodeList(`https://rickandmortyapi.com/api/episode?page=${page}`)
  })
}

loadMoreEpisodes() 

// show characters in main area

function showCharacters(name, date, episode, characters) {
  const mainTitle = document.createElement("h1")
  const subTitle = document.createElement("h2")

  titleBox.style.display = "block"
  displayBox.style.marginTop = "0"
  displayBox.style.paddingTop = "0"
  displayBox.style.borderTop = "none"

  titleBox.innerHTML = ""
  displayBox.innerHTML = ""
  mainTitle.innerText = name
  subTitle.innerText = `${date} | ${episode}`

  root.appendChild(mainArea)
  mainArea.appendChild(titleBox)
  titleBox.appendChild(mainTitle)
  titleBox.appendChild(subTitle)
  mainArea.appendChild(displayBox)

  createCharacter(characters)
}

// show character details in main area

function showCharacterDetails(image, name, species, status, gender, origin, episodes) {
  const characterImg = document.createElement("img")
  const titles = document.createElement("div")
  const mainTitle = document.createElement("h1")
  const subTitle = document.createElement("h2")

  titleBox.style.display = "flex"
  displayBox.style.marginTop = "100px"
  displayBox.style.paddingTop = "100px"
  displayBox.style.borderTop = "solid 1px"
  characterImg.style.marginRight = "30px"

  titleBox.innerHTML = ""
  displayBox.innerHTML = ""
  characterImg.src = image
  mainTitle.innerText = name
  subTitle.innerText = `${species} | ${status} | ${gender} | ${origin.name}`

  titles.appendChild(mainTitle)
  titles.appendChild(subTitle)
  titleBox.appendChild(characterImg)
  titleBox.appendChild(titles)
  mainArea.appendChild(titleBox)
  mainArea.appendChild(displayBox)

  createEpisodeCards(episodes)

  subTitle.addEventListener("click", () => {
    showLocationDetails(origin.url)
  })
}

// show location details in main area

async function showLocationDetails(url) {
  const location = await makeRequest(url)
  const mainTitle = document.createElement("h1")
  const subTitle = document.createElement("h2")

  titleBox.style.display = "block"
  displayBox.style.marginTop = "0"
  displayBox.style.paddingTop = "0"
  displayBox.style.borderTop = "none"

  titleBox.innerHTML = ""
  displayBox.innerHTML = ""
  mainTitle.innerText = location.name
  subTitle.innerText = location.dimension
  titleBox.appendChild(mainTitle)
  titleBox.appendChild(subTitle)
  mainArea.appendChild(titleBox)
  mainArea.appendChild(displayBox)

  createCharacter(location.residents)
}


// create character cards

async function createCharacter(URLs) {
  const characters = await resolvePromises(URLs)
  characters.forEach(({image, name, species, status, gender, origin, episode}) => {
    const characterCard = document.createElement("div")
    const characterImg = document.createElement("img")
    const characterName = document.createElement("h3")
    const characterDetails = document.createElement("h3")

    characterCard.classList.add("character-card")
    characterImg.classList.add("character-card-img")
    characterName.classList.add("card-main-title")
    characterDetails.classList.add("card-sub-title")

    characterImg.src = image
    characterName.innerText = name
    characterDetails.innerText = `${species} | ${status}`

    displayBox.appendChild(characterCard)
    characterCard.appendChild(characterImg)
    characterCard.appendChild(characterName)
    characterCard.appendChild(characterDetails)

    characterCard.addEventListener("click", () => {
      showCharacterDetails(image, name, species, status, gender, origin, episode)
    })
  })
}

// create episode cards

async function createEpisodeCards(URLs) {
  const episodes = await resolvePromises(URLs)
  episodes.forEach(({id, episode}) => {
    const episodeCard = document.createElement("div")
    const episodeNumber = document.createElement("h3")
    const episodeCode = document.createElement("h3")

    episodeCard.classList.add("episode-card")
    episodeNumber.classList.add("card-main-title")
    episodeCode.classList.add("card-sub-title")

    episodeNumber.innerText = `Episode ${id}`
    episodeCode.innerText = episode

    displayBox.appendChild(episodeCard)
    episodeCard.appendChild(episodeNumber)
    episodeCard.appendChild(episodeCode)
  })
}