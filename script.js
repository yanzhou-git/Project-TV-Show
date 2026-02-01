//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(allEpisodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  allEpisodes.forEach(({ name, season, number, image, summary }) => {
    const seasonEpisode = `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
    const clone = document
      .getElementById("film-template")
      .content.cloneNode(true);

    clone.querySelector("h3").textContent = `${name} - ${seasonEpisode}`;
    clone.querySelector("img").src = image.medium;
    clone.querySelector("img").alt = name;
    clone.querySelector("p").innerHTML = summary;

    rootElem.appendChild(clone);
  });
}

window.onload = setup;
