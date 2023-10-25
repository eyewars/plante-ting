"use strict";
// yo
let categoryUrl = "https://sukkergris.no/plantcategories/";
let plantViewUrl = "https://sukkergris.no/plants/?category=";
let detailViewUrl = "https://sukkergris.no/plant/?id=";

async function getCategoryData(category) {
  try {
    let response = await fetch(categoryUrl);

    if (response.status != 200) {
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();

    return data[category].kategori;
  } catch (error) {
    console.log(error);
  }
}
//lviet
async function getPlantViewData(category) {
  try {
    let response = await fetch(plantViewUrl + (await getCategoryData(category)));

    if (response.status != 200) {
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getDetailViewData(id) {
  try {
    let response = await fetch(detailViewUrl + id);

    if (response.status != 200) {
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();

    //console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

function plantViewUI(plantArr) {
  for (let plant of plantArr) {
    const plantContainer = document.createElement("div");
    plantContainer.classList.add("plantContainer");

    const textContainer = document.createElement("div");
    textContainer.classList.add("textContainer");

    const pic = document.createElement("img");
    pic.src = "http://sukkergris.no/plantimages/small/" + plant.bildefil;
    pic.onclick = function () {
      window.location.href = "detail.html?id=" + plant.id;
    };

    const name = document.createElement("h3");
    name.innerText = plant.navn;

    const descr = document.createElement("p");
    descr.innerText = plant.beskrivelse;

    const price = document.createElement("p");
    price.innerText = "kr " + plant.pris + ",-";

    const line = document.createElement("hr");
    line.classList.add("line");

    textContainer.appendChild(name);
    textContainer.appendChild(descr);
    textContainer.appendChild(price);

    plantContainer.appendChild(pic);
    plantContainer.appendChild(textContainer);

    document.getElementById("container").appendChild(plantContainer);
    document.getElementById("container").appendChild(line);
  }

  document.getElementById("planteKategori").innerText = plantArr[0].kategori;
}

function detailViewUI(detail) {
  const detailContainer = document.createElement("div");
  detailContainer.classList.add("detailContainer");

  const picContainer = document.createElement("div");
  picContainer.classList.add("picContainer");

  const pic = document.createElement("img");
  pic.src = "https://sukkergris.no/plantimages/large/" + detail.bildefil;
  pic.src = pic.src.replace("png", "jpg");
  pic.classList.add("bigPic");

  const picTextContainer = document.createElement("div");
  picTextContainer.classList.add("picTextContainer");

  const picText = document.createElement("h1");
  picText.innerText = detail.navn;

  const categoryText = document.createElement("p");
  categoryText.innerText = "Kategori: " + detail.kategori;

  const line = document.createElement("hr");
  line.classList.add("line2");

  const descr = document.createElement("p");
  descr.innerText = detail.beskrivelse;
  descr.classList.add("description");

  const line2 = document.createElement("hr");
  line2.classList.add("line2");

  const textContainer = document.createElement("div");
  textContainer.classList.add("textContainerBig");

  const height = document.createElement("p");
  height.innerText = "Normal høyde: " + detail.hoide + " cm";

  const vekstsone = document.createElement("p");
  vekstsone.innerText = "Vekstsone: " + detail.vekstsone;

  const mix = document.createElement("p");
  mix.innerText = `Ambefalt gjødselmix: ${detail.nitrogen}% nitrogen, ${detail.kalium}% kalium, og ${detail.fosfor}% fosfor. Bør ikke plantes hvis temperaturen om dagen er under ${detail.min_temp_dag} grader, eller temperaturen om natten er under ${detail.min_temp_natt} grader.`;

  const line3 = document.createElement("hr");
  line3.classList.add("line2");

  const price = document.createElement("p");
  price.innerText = "kr " + detail.pris + ",-";

  textContainer.appendChild(height);
  textContainer.appendChild(vekstsone);
  textContainer.appendChild(mix);

  picTextContainer.appendChild(picText);

  picContainer.appendChild(pic);
  picContainer.appendChild(picTextContainer);

  detailContainer.appendChild(picContainer);
  detailContainer.appendChild(line);
  detailContainer.appendChild(descr);
  detailContainer.appendChild(line2);
  detailContainer.appendChild(textContainer);
  detailContainer.appendChild(line3);
  detailContainer.appendChild(price);

  document.getElementById("container").appendChild(detailContainer);
}

async function changeWindowPlant(category) {
  window.location.href = "plant.html?category=" + category;
}

async function displayPlantView() {
  if (window.location.href.includes("index.html")) return;
  else if (window.location.href.includes("plant.html")) {
    let category = new URLSearchParams(window.location.search).get("category");
    plantViewUI(await getPlantViewData(category));
  } else if (window.location.href.includes("detail.html")) {
    let id = new URLSearchParams(window.location.search).get("id");
    detailViewUI(await getDetailViewData(id));
  }
}

window.addEventListener("load", displayPlantView);
