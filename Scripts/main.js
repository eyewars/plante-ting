"use strict";

import { getPlantViewData, getDetailViewData, getPlantZoneData } from "./getData.js";
import { plantViewUI, detailViewUI, createShoppingCartUI, createCheckoutUI, createConfirmationUI, createHeaderUserUI, createRegisterUI, createLoginUI, createUserSettingsUI } from "./createUI.js";

async function changeWindowPlant(category) {
	window.location.href = "plant.html?category=" + category;
}

async function changeWindowPlantSearch() {
	window.location.href = "plant.html?searchType=" + document.getElementById("searchInput").value;
}

function changeWindowCart() {
	window.location.href = "cart.html";
}

async function displayPlantView() {
	document.getElementById("searchInput").value = "";
	if (window.location.href.includes("index.html")) return;
	else if (window.location.href.includes("plant.html")) {
		let authToken;
		if (sessionStorage.loginData != undefined) {
			authToken = JSON.parse(sessionStorage.loginData).token;
		}

		if (!window.location.href.includes("searchType")) {
			let category = new URLSearchParams(window.location.search).get("category");
			plantViewUI(await getPlantViewData(category, true, authToken));
		} else {
			let searchType = new URLSearchParams(window.location.search).get("searchType");

			let plantArr = [];
			for (let i = 0; i < 7; i++) {
				let plants = await getPlantViewData(i, true, authToken);

				for (let j = 0; j < plants.length; j++) {
					if (plants[j].name.includes(searchType)) {
						plantArr.push(plants[j]);
					}
				}
			}
			plantViewUI(plantArr, true);
		}
	} else if (window.location.href.includes("detail.html")) {
		let authToken;
		if (sessionStorage.loginData != undefined) {
			authToken = JSON.parse(sessionStorage.loginData).token;
		}

		let id = new URLSearchParams(window.location.search).get("id");
		let plant = await getDetailViewData(id, authToken);
		detailViewUI(plant, await getPlantZoneData(plant.zone_id));
	}
	else if (window.location.href.includes("cart.html")) {
		createShoppingCartUI();
	}
	else if (window.location.href.includes("checkout.html")) {
		createCheckoutUI();
	}
	else if (window.location.href.includes("confirmation.html")) {
		createConfirmationUI();
	}
	else if (window.location.href.includes("register.html")) {
		createRegisterUI();
	}
	else if (window.location.href.includes("login.html")) {
		createLoginUI();
	}
	else if (window.location.href.includes("userSettings.html")) {
		createUserSettingsUI();
	}
}

window.addEventListener("load", displayPlantView);

if (!window.location.href.includes("index.html") && !window.location.href.includes("plant.html") && !window.location.href.includes("detail.html") && !window.location.href.includes("cart.html") && !window.location.href.includes("checkout.html") && !window.location.href.includes("confirmation.html") && !window.location.href.includes("register.html") && !window.location.href.includes("registerConfirmation.html") && !window.location.href.includes("login.html") && !window.location.href.includes("loginConfirmation.html") && !window.location.href.includes("userSettings.html") && !window.location.href.includes("userChange.html")) {
	window.location.href = "index.html";
}

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

createHeaderUserUI();

