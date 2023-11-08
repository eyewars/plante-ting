"use strict";

import { addToCart, changeCartPlant, removePlantFromCart, emptyCart } from "./buyPlant.js";

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
    addToCart(detail);
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

export function createShoppingCartUI(){
  let cart = JSON.parse(localStorage.cart);

  let fullContainer = document.getElementById("fullContainer");
  fullContainer.innerHTML = "";

  let topContainer = document.createElement("div");
  topContainer.classList.add("cartTopContainer");

  let checkOutButton = document.createElement("button");
  checkOutButton.innerText = "Gå til betaling";

  let tempTotal = 0;
  for (let i = 0; i < cart.length; i++){
    for (let j = 0; j < cart[i][1]; j++){
      tempTotal += cart[i][0].price;
    }
  }

  let totalPrice = document.createElement("h2");
  totalPrice.innerText = "Totalpris: kr " + tempTotal + ",-";

  let emptyButton = document.createElement("button");
  emptyButton.classList.add("emptyCartButton");
  emptyButton.innerText = "Tøm handlekurv";
  emptyButton.addEventListener("click", function(){
    emptyCart();
  })

  let line = document.createElement("hr");
  line.classList.add("line2");

  topContainer.appendChild(checkOutButton);
  topContainer.appendChild(totalPrice);
  topContainer.appendChild(emptyButton);

  fullContainer.appendChild(topContainer);
  fullContainer.appendChild(line);

  for (let i = 0; i < cart.length; i++){
    let plantContainer = document.createElement("div");
    plantContainer.classList.add("cartPlantContainer");

    let plantId = document.createElement("p");
    plantId.innerText = "Id: " + cart[i][0].id;

    let plantName = document.createElement("p");
    plantName.innerText = cart[i][0].name;

    let numberOfPlantsContainer = document.createElement("div");
    numberOfPlantsContainer.classList.add("numberOfPlantsContainer");

    let plantAmount = document.createElement("p");
    plantAmount.innerText = "Antall: " + cart[i][1];

    let minusButton = document.createElement("button");
    minusButton.classList.add("cartAmountButton");
    minusButton.innerText = "-";
    minusButton.addEventListener("click", function(){
      changeCartPlant(i, false);
    })

    let plusButton = document.createElement("button");
    plusButton.classList.add("cartAmountButton");
    plusButton.innerText = "+";
    plusButton.addEventListener("click", function(){
      changeCartPlant(i, true);
    })

    numberOfPlantsContainer.appendChild(plantAmount);
    numberOfPlantsContainer.appendChild(minusButton);
    numberOfPlantsContainer.appendChild(plusButton);

    let plantPrice = document.createElement("p");
    plantPrice.innerText = "kr " + cart[i][0].price + ",-";

    let plantPriceTotal = document.createElement("p");
    plantPriceTotal.innerText = "Total pris: kr " + (cart[i][0].price * cart[i][1]) + ",-";

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("removeFromCartButton");
    deleteButton.innerText = "Fjern fra kurv";
    deleteButton.addEventListener("click", function(){
      removePlantFromCart(i);
    })

    let line2 = document.createElement("hr");
    line2.classList.add("line2");

    plantContainer.appendChild(plantId);
    plantContainer.appendChild(plantName);
    plantContainer.appendChild(numberOfPlantsContainer);
    plantContainer.appendChild(plantPrice);
    plantContainer.appendChild(plantPriceTotal);
    if (cart[i][0].stock == 0){
      let temp = new Date(cart[i][0].expected_shipped);
      let shippingText = document.createElement("p");
      shippingText.innerText = "Forventet på lager: " + temp.toString().substring(4, 15);

      plantContainer.appendChild(shippingText);
    }
    plantContainer.appendChild(deleteButton);

    fullContainer.appendChild(plantContainer);
    fullContainer.appendChild(line2)
  }

  document.getElementById("container").appendChild(fullContainer);
}

