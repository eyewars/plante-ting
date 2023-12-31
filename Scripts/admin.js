"use strict";

import { getPlantViewData, getAuthenticationToken, addChangePlantData, deletePlant, listUsers, deleteUser } from "./getData.js";

import { createAdminPlantUI, createAdminOrderUI, createAdminUserUI, createCommentUI } from "./createUI.js";

async function adminLogin() {
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	let authentication = await getAuthenticationToken(username, password);

	if (authentication.msg == "administrator login OK") {
		sessionStorage.auth = JSON.stringify(authentication);

		window.location.href = "admin2.html";
	} else {
		document.getElementById("password").value = "";
		alert("Wrong password or username");
	}
}

// carlvonlinne@helseflora.no
// pollendust
if (window.location.href.includes("admin.html")) {
	document.getElementById("adminFormButton").addEventListener("click", function () {
		adminLogin();
	});
} else if (window.location.href.includes("admin2.html")) {
	for (let i = 1; i < 5; i++) {
		document.getElementById("adminSiteButton" + i).addEventListener("click", function () {
			adminPageChange(i);
		});
	}
} else if (window.location.href.includes("adminPlants.html")) {
	let myForm = document.getElementById("createPlantForm");
	myForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		let formData = new FormData(myForm);
		let authToken = JSON.parse(sessionStorage.auth).logindata.token;

		if (event.submitter.id == "adminFormButton") {
			addChangePlantData(authToken, formData, "POST");
		}
		else if (event.submitter.id == "adminFormButton2") {
			if (plantListedId != null) {
				formData.append("id", plantListedId);
				addChangePlantData(authToken, formData, "PUT");
			}
			else alert("List opp en plante for å kunne endre");
		}
		else {
			deletePlant(authToken, plantListedId);
		}
	})

	let plantListedId = null;

	document.getElementById("plantListButton").addEventListener("click", async function () {
		let plantListInputName = document.getElementById("plantListInput").value;
		let plant;

		let authToken = JSON.parse(sessionStorage.auth).logindata.token;
		let plants = await getPlantViewData(null, false, authToken);

		for (let i = 0; i < plants.length; i++) {
			if (plants[i].name.includes(plantListInputName)) {
				plant = plants[i];
				break;
			}
		}
		plantListedId = plant.id;
		createAdminPlantUI(plant);
	});
} else if (window.location.href.includes("adminOrders.html")) {
	let authToken = JSON.parse(sessionStorage.auth).logindata.token;

	createAdminOrderUI(authToken);
} else if (window.location.href.includes("adminUsers.html")) {
	let authToken = JSON.parse(sessionStorage.auth).logindata.token;

	document.getElementById("userListButton").addEventListener("click", async function () {
		let users = await listUsers(authToken);
		let user;
		let usernameSearch = document.getElementById("userListInput").value;

		for (let i = 0; i < users.length; i++) {
			if (users[i].username == usernameSearch) {
				user = users[i];
				break;
			}
		}

		createAdminUserUI(user);
	})

	document.getElementById("userDeleteButton").addEventListener("click", async function () {
		let users = await listUsers(authToken);
		let user;
		let usernameSearch = document.getElementById("userListInput").value;

		for (let i = 0; i < users.length; i++) {
			if (users[i].username == usernameSearch) {
				user = users[i];
				break;
			}
		}

		deleteUser(authToken, user.id);
	})
} else if (window.location.href.includes("adminComments.html")) {
	createCommentUI(null, true);
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