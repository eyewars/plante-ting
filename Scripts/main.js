"use strict";
//OLMALY81
let key = "key=OLMALY81";
let categoryUrl = "https://helseflora.herokuapp.com/webshop/categories";
let plantViewUrl = "https://helseflora.herokuapp.com/webshop/plants?category=";
let detailViewUrl = "https://helseflora.herokuapp.com/webshop/plants?id=";
let plantZoneUrl = "https://helseflora.herokuapp.com/botany/plantzones";

import { addToCart } from "./buyPlant.js";
import { plantViewUI, detailViewUI } from "./createUI.js";

async function getCategoryData(category) {
  try {
    let response = await fetch(categoryUrl + "?" + key);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I getCategoryData()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    //console.log(data);

    return data[category].id;
  } catch (error) {
    console.log(error);
  }
}

async function getPlantViewData(category) {
  try {
    let response = await fetch(plantViewUrl + (await getCategoryData(category)) + "&" + key);

    //console.log(plantViewUrl + (await getCategoryData(category)) + "&" + key);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I getPlantViewData()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getDetailViewData(id) {
  try {
    let response = await fetch(detailViewUrl + id + "&" + key);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I getDetailViewData()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();

    //console.log(data[0]);
    return data[0];
  } catch (error) {
    console.log(error);
  }
}

async function getPlantZoneData(id) {
  try {
    let response = await fetch(plantZoneUrl + "?" + key);
    //console.log(plantZoneUrl + "?" + key);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I getPlantZoneData()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();

    return data[id];
  } catch (error) {
    console.log(error);
  }
}

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
      plantViewUI(await getPlantViewData(category));
    } else {
      let searchType = new URLSearchParams(window.location.search).get("searchType");

      let plantArr = [];
      for (let i = 0; i < 7; i++) {
        let plants = await getPlantViewData(i);

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

if (window.location.href.includes("index.html")) {
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





*/
