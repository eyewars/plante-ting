"use strict";
//OLMALY81

import { getPlantViewData, getDetailViewData, getPlantZoneData } from "./getData.js";
import { plantViewUI, detailViewUI } from "./createUI.js";

async function changeWindowPlant(category) {
  window.location.href = "plant.html?category=" + category;
}

async function changeWindowPlantSearch() {
  console.log("HEISANN JEG TRYKKA LOOOL");
  window.location.href = "plant.html?searchType=" + document.getElementById("searchInput").value;
}

function changeWindowCart() {
  window.location.href = "cart.html";
}

async function displayPlantView() {
  document.getElementById("searchInput").value = "";
  if (window.location.href.includes("index.html")) return;
  else if (window.location.href.includes("plant.html")) {
    if (!window.location.href.includes("searchType")) {
      let category = new URLSearchParams(window.location.search).get("category");
      plantViewUI(await getPlantViewData(category, true));
    } else {
      let searchType = new URLSearchParams(window.location.search).get("searchType");

      let plantArr = [];
      for (let i = 0; i < 7; i++) {
        let plants = await getPlantViewData(i, true);

        for (let j = 0; j < plants.length; j++) {
          if (plants[j].name.includes(searchType)) {
            plantArr.push(plants[j]);
          }
        }
      }
      plantViewUI(plantArr, true);
    }
  } else if (window.location.href.includes("detail.html")) {
    let id = new URLSearchParams(window.location.search).get("id");
    let plant = await getDetailViewData(id);
    detailViewUI(plant, await getPlantZoneData(plant.zone_id));
  }
}

window.addEventListener("load", displayPlantView);

if (!window.location.href.includes("index.html") && !window.location.href.includes("plant.html") && !window.location.href.includes("detail.html") && !window.location.href.includes("cart.html")){
  window.location.href = "index.html";
}

if (window.location.href.includes("index.html")){
  for (let i = 1; i < 7; i++) {
    document.getElementById("categoryButton" + i).addEventListener("click", function () {
      changeWindowPlant(i);
    });
  }
}

document.getElementById("shoppingCart").addEventListener("click", function () {
  changeWindowCart();
});

document.getElementById("plantSearch").addEventListener("click", function () {
  changeWindowPlantSearch();
});

/*
TODO:

1. Bytt ut .includes() med noe regex shit (+ da kan vi få den til å funke med små og store bokstaver)
2. Responsive design
3. Oppdater admin login ui
4. Tror man skulle kunne se extra_3 og 4 i adminPlants.html sida (dobbel sjekk)
5. HUSK Å GJØRE SÅNN AT ALLE ERRORS VISES TIL BRUKEREN OG IKKE BARE I KONSOLLEN!!!!!!!!!!!!!!!!!




*/
