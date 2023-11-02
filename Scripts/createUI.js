"use strict";

import { addToCart } from "./buyPlant.js";

export function plantViewUI(plantArr, fromSearch) {
  if (plantArr[0] == null) {
    const noPlantText = document.createElement("h2");
    noPlantText.innerText = "Your search did not match any plants";

    document.getElementById("container").appendChild(noPlantText);
  } else {
    for (let plant of plantArr) {
      //console.log(plant);
      const plantContainer = document.createElement("div");
      plantContainer.classList.add("plantContainer");

      const textContainer = document.createElement("div");
      textContainer.classList.add("textContainer");

      const pic = document.createElement("img");
      pic.src = plant.thumb;
      pic.onclick = function () {
        window.location.href = "detail.html?id=" + plant.id;
      };

      const name = document.createElement("h3");
      name.innerText = plant.name;

      const descr = document.createElement("p");
      descr.innerText = plant.description;

      const price = document.createElement("p");
      price.innerText = "kr " + plant.price + ",-";

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

    if (fromSearch == undefined) {
      document.getElementById("planteKategori").innerText = plantArr[0].category_name;
    } else document.getElementById("planteKategori").innerText = "Not categorized";
  }
}

export function detailViewUI(detail, zone) {
  //console.log(detail);
  const detailContainer = document.createElement("div");
  detailContainer.classList.add("detailContainer");

  const picContainer = document.createElement("div");
  picContainer.classList.add("picContainer");

  const pic = document.createElement("img");
  pic.src = detail.image;
  pic.classList.add("bigPic");

  const picTextContainer = document.createElement("div");
  picTextContainer.classList.add("picTextContainer");

  const picText = document.createElement("h1");
  picText.innerText = detail.name;

  const picDiscountText = document.createElement("h2");
  picDiscountText.innerText = detail.discount + "%" + " salg!!";
  if (detail.discount <= 0) {
    picDiscountText.classList.add("hidden");
  }

  const categoryText = document.createElement("p");
  categoryText.innerText = "Kategori: " + detail.category_name;

  const line = document.createElement("hr");
  line.classList.add("line2");

  const descr = document.createElement("p");
  descr.innerText = detail.description;
  descr.classList.add("description");

  const line2 = document.createElement("hr");
  line2.classList.add("line2");

  const textContainer = document.createElement("div");
  textContainer.classList.add("textContainerBig");

  const height = document.createElement("p");
  height.innerText = "Normal høyde: " + detail.height + " cm";

  const vekstsone = document.createElement("p");
  vekstsone.innerText = "Vekstsone: " + zone.name;

  const vekstsoneDescr = document.createElement("p");
  vekstsoneDescr.innerText = zone.description;

  const mix = document.createElement("p");
  mix.innerText = `Ambefalt gjødselmix: ${detail.nitrogen}% nitrogen, ${detail.potassium}% kalium, og ${detail.phosphor}% fosfor. Bør ikke plantes hvis temperaturen om dagen er under ${detail.min_temp_day} grader, eller temperaturen om natten er under ${detail.min_temp_night} grader.`;

  const line3 = document.createElement("hr");
  line3.classList.add("line2");

  const price = document.createElement("p");
  price.innerText = "kr " + detail.price + ",-";

  const stock = document.createElement("p");
  if (detail.stock != 0) {
    stock.innerText = detail.stock + " på lager";
  } else {
    let temp = new Date(detail.expected_shipped);
    stock.innerText = "Forventet på lager: " + temp.toString().substring(4, 15);
  }

  const rating = document.createElement("p");
  rating.innerText = detail.rating;

  if (detail.rating == null) {
    picDiscountText.classList.add("hidden");
  }

  const buyPlant = document.createElement("button");
  buyPlant.innerText = "Kjøp den planten";
  buyPlant.addEventListener("click", function () {
    addToCart();
  });

  textContainer.appendChild(height);
  textContainer.appendChild(vekstsone);
  textContainer.appendChild(vekstsoneDescr);
  textContainer.appendChild(mix);

  picTextContainer.appendChild(picText);
  picTextContainer.appendChild(picDiscountText);

  picContainer.appendChild(pic);
  picContainer.appendChild(picTextContainer);

  detailContainer.appendChild(picContainer);
  detailContainer.appendChild(categoryText);
  detailContainer.appendChild(line);
  detailContainer.appendChild(descr);
  detailContainer.appendChild(line2);
  detailContainer.appendChild(textContainer);
  detailContainer.appendChild(line3);
  detailContainer.appendChild(price);
  detailContainer.appendChild(stock);
  detailContainer.appendChild(rating);
  detailContainer.appendChild(buyPlant);

  document.getElementById("container").appendChild(detailContainer);
}

export function createAdminPlantUI(plant) {
  let container = document.getElementById("bottomPartContainer");
  container.innerHTML = "";

  let myForm = document.createElement("form");
  myForm.id = "editPlantForm";

  let tempContainer = document.createElement("div");
  tempContainer.classList.add("adminPlantContainer");

  let tempPic = document.createElement("img");
  tempPic.src = plant.thumb;

  tempContainer.appendChild(tempPic);

  container.appendChild(tempContainer);

  for (let key in plant) {
    if (key == "thumb") continue;
    let tempContainer = document.createElement("div");
    tempContainer.classList.add("adminPlantContainer");

    let tempKey = document.createElement("p");
    tempKey.classList.add("adminPlantKey");
    tempKey.innerText = key + ":";

    let tempText = document.createElement("p");
    tempText.innerText = String(plant[key]);

    tempContainer.appendChild(tempKey);
    tempContainer.appendChild(tempText);

    container.appendChild(tempContainer);
  }
}