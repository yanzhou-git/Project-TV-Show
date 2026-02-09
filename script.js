//You can edit ALL of the code here
let allEpisodes = [];

async function setup() {
  try {
    showLoading();
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allEpisodes = await response.json();

    render(allEpisodes);
    populateEpisodeSelector();
    setupSearch();
    setupEpisodeSelector();
  } catch (error) {
    showError(error.message);
  }
}

// ----- Loading Indicator -----
function showLoading() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<div class="loading">Loading episodes...</div>`;

  const countElem = document.getElementById("episode-count");
  countElem.textCOntent = `Loading...`;
}

// ----- Error Handler ----
function showError(message) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<div class="error">
      <h2>⚠️ Error Loading Episodes</h2>
      <p>${message}</p>
      <p>Please refresh the page to try again.</p>
    </div>`;

  const countElem = document.getElementById("episode-count");
  countElem.textContent = "Error loading episodes";
}

function filterEpisodes(searchTerm) {
  if (searchTerm === "") {
    return allEpisodes;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  const filtered = allEpisodes.filter(({ name, summary }) => {
    const nameMatch = name.toLowerCase().includes(lowerSearchTerm);
    const summaryMatch = summary.toLowerCase().includes(lowerSearchTerm);
    return nameMatch || summaryMatch;
  });
  return filtered;
}

function render(episodesToShow) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const countElem = document.getElementById("episode-count");
  const totalEpisodes = allEpisodes.length;
  countElem.textContent = `Displaying ${episodesToShow.length}/${totalEpisodes} episodes`;
  episodesToShow.forEach(({ name, season, number, image, summary }) => {
    const seasonEpisode = `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
    const clone = document
      .getElementById("film-template")
      .content.cloneNode(true);

    const card = clone.querySelector(".film-card");
    card.id = `episode-${season}-${number}`;
    clone.querySelector("h3").textContent = `${name} - ${seasonEpisode}`;
    clone.querySelector("img").src = image.medium;
    clone.querySelector("img").alt = name;
    clone.querySelector("p").innerHTML = summary;

    rootElem.appendChild(clone);
  });
}

function populateEpisodeSelector() {
  const selector = document.getElementById("episode-selector");
  selector.innerHTML = '<option value="">Select an episode...</option>';

  allEpisodes.forEach(({ name, season, number }) => {
    const seasonEpisode = `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = `${season}-${number}`;
    option.textContent = `${seasonEpisode} - ${name}`;

    selector.appendChild(option);
  });
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value;
    const filteredEpisodes = filterEpisodes(searchTerm);
    render(filteredEpisodes);
  });
}

function setupEpisodeSelector() {
  const selector = document.getElementById("episode-selector");

  selector.addEventListener("change", function () {
    const selectedValue = selector.value;
    if (selectedValue === "") {
      return;
    }
    const episodeCard = document.getElementById(`episode-${selectedValue}`);
    if (episodeCard) {
      episodeCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      episodeCard.classList.add("highlighted");
      setTimeout(function () {
        episodeCard.classList.remove("highlighted");
      }, 2000);
    }
    selector.value = "";
  });
}

window.onload = setup;
