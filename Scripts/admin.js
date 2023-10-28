"use strict";

import {getPlantViewData, getDetailViewData, getPlantZoneData } from "./getData.js";

function adminLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username == "carlvonlinne@helseflora.no" && password == "pollendust") {
    window.location.href = "admin2.html";
  } else {
    document.getElementById("password").value = "";
    alert("Wrong password or username");
  }
}

// carlvonlinne@helseflora.no
// pollendust
if (window.location.href.includes("admin.html")){
    document.getElementById("adminFormButton").addEventListener("click", function(){
    adminLogin();
  })
}
else if(window.location.href.includes("admin2.html")){
  for (let i = 1; i < 5; i++){
    document.getElementById("adminSiteButton" + i).addEventListener("click", function(){
      adminPageChange(i);
    })
  }
}
else if(window.location.href.includes("adminPlants.html")){
  document.getElementById("plantListButton").addEventListener("click", async function(){
    let plantListInputName = document.getElementById("plantListInput").value;
    let plant;

    let plants = await getPlantViewData(null, false);

    for (let i = 0; i < plants.length; i++){
      if (plants[i].name.includes(plantListInputName)) {
        plant = plants[i];
        break;
      }
    }
    createPlantUI(plant);
  })
}

function adminPageChange(page) {
  switch (page) {
    case 1:
      window.location.href = "adminPlants.html";
      break;
    case 2:
      window.location.href = "adminOrders.html";
      break;
    case 3:
      window.location.href = "adminUsers.html";
      break;
    case 4:
      window.location.href = "adminComments.html";
      break;
  }
}

function createPlantUI(plant){
  let container = document.getElementById("bottomPartContainer");
  for (let key in plant){
    if (key == "thumb") continue
    let tempContainer = document.createElement("div");

    let tempKey = document.createElement("p");
    tempKey.innerText = key;

    let tempText = document.createElement("p");
    tempText.innerText = plant[key];

    let tempButton = document.createElement("button");
    tempButton.innerText = "edit";
    
    tempContainer.appendChild(tempKey);
    tempContainer.appendChild(tempText);
    tempContainer.appendChild(tempButton);

    container.appendChild(tempContainer);
  }
}
