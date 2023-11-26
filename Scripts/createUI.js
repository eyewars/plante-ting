"use strict";

import { addToCart, changeCartPlant, removePlantFromCart, emptyCart } from "./buyPlant.js";

import { getShippingMethods, sendOrder, getOrder, deleteOrder, registerUser, loginUser, listUsers, addComment, listComment } from "./getData.js";

export function plantViewUI(plantArr, fromSearch) {
	if (plantArr[0] == null) {
		const noPlantText = document.createElement("h2");
		noPlantText.innerText = "Your search did not match any plants";

		document.getElementById("container").appendChild(noPlantText);
	} else {
		for (let plant of plantArr) {
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
	rating.innerText = detail.rating.toFixed(2) + " Stjerner";

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

	if (sessionStorage.loginData != undefined){
		let makeCommentContainer = document.createElement("div");
		makeCommentContainer.classList.add("makeCommentContainer");

		let makeCommentText = document.createElement("h3");
		makeCommentText.innerText = "Legg igjen en kommentar";

		let ratingContainer = document.createElement("div");
		ratingContainer.setAttribute("id", "ratingContainer");

		let rating = document.createElement("select");
		rating.setAttribute("name", "rating");

		for (let i = 1; i <= 5; i++){
			let ratingOption = document.createElement("option");
			ratingOption.value = i;
			ratingOption.innerText = i;

			rating.appendChild(ratingOption);
		}

		let ratingText = document.createElement("p");
		ratingText.innerText = "Stjerner";

		let commentBox = document.createElement("textarea");
		commentBox.setAttribute("name", "comment_text");

		let submitCommentButton = document.createElement("button");
		submitCommentButton.innerText = "Legg igjen kommentar";
		submitCommentButton.addEventListener("click", async function(){
			let comment = {
				comment_text: commentBox.value,
				rating: rating.value,
				plant_id: detail.id
			};

			let authToken = JSON.parse(sessionStorage.loginData).token;

			await addComment(authToken, JSON.stringify(comment));

			if (hasShownComments){
				document.getElementById("commentFullContainer").innerHTML = "";

				createCommentUI(detail.id);
			}

			commentBox.value = "";
		})

		ratingContainer.appendChild(rating);
		ratingContainer.appendChild(ratingText);

		makeCommentContainer.appendChild(makeCommentText);
		makeCommentContainer.appendChild(ratingContainer);
		makeCommentContainer.appendChild(commentBox);
		makeCommentContainer.appendChild(submitCommentButton);

		detailContainer.appendChild(makeCommentContainer);
	}

	let hasShownComments = false;

	let showCommentsButton = document.createElement("button");
	showCommentsButton.innerText = "Vis kommentarfelt";
	showCommentsButton.addEventListener("click", function(){
		createCommentUI(detail.id);
		hasShownComments = true;
		showCommentsButton.classList.add("hidden");
	})

	detailContainer.appendChild(showCommentsButton);

	document.getElementById("container").appendChild(detailContainer);
}

async function createCommentUI(plantId){
	let commentFullContainer = document.createElement("div");
	commentFullContainer.setAttribute("id", "commentFullContainer");
	commentFullContainer.classList.add("commentFullContainer");

	let authToken;
	if (sessionStorage.loginData != undefined){
		authToken = JSON.parse(sessionStorage.loginData).token;
	}

	let comments = await listComment(authToken, plantId)

	for (let i = 0; i < comments.length; i++){
		let tempFullCommentContainer = document.createElement("div");
		tempFullCommentContainer.classList.add("tempFullCommentContainer");

		let tempTopContainer = document.createElement("div");
		tempTopContainer.classList.add("tempTopContainer");

		let tempPersonContainer = document.createElement("div");
		tempPersonContainer.classList.add("tempPersonContainer");

		let user;
		if (authToken != undefined){
			user = await listUsers(authToken, comments[i].user_id);

			user = user[0];
		}
		else {
			user = {
				full_name: "Anonymous", 
				thumb: "./Assets/bilde.PNG"
			}
		}

		let tempImg = document.createElement("img");
		tempImg.src = user.thumb;

		let tempName = document.createElement("h3");
		tempName.innerText = user.full_name;

		let tempRating = document.createElement("h3");

		if (comments[i].rating == 1){
			tempRating.innerText = comments[i].rating + " Stjerne";
		}
		else tempRating.innerText = comments[i].rating + " Stjerner";

		let tempCommentContainer = document.createElement("div");
		tempCommentContainer.classList.add("tempCommentContainer");

		let tempCommentText = document.createElement("p");
		tempCommentText.innerText = comments[i].comment_text;

		tempPersonContainer.appendChild(tempImg);
		tempPersonContainer.appendChild(tempName);

		tempTopContainer.appendChild(tempPersonContainer);
		tempTopContainer.appendChild(tempRating);

		tempCommentContainer.appendChild(tempCommentText);

		tempFullCommentContainer.appendChild(tempTopContainer);
		tempFullCommentContainer.appendChild(tempCommentContainer);

		commentFullContainer.appendChild(tempFullCommentContainer);
	}

	document.getElementById("container").appendChild(commentFullContainer);
}

export function createAdminPlantUI(plant) {
	let container = document.getElementById("bottomPartContainer");
	container.innerHTML = "";

	let tempContainer = document.createElement("div");
	tempContainer.classList.add("adminContainer");

	let tempPic = document.createElement("img");
	tempPic.src = plant.thumb;

	tempContainer.appendChild(tempPic);

	container.appendChild(tempContainer);

	for (let key in plant) {
		if (key == "thumb") continue;
		let tempContainer = document.createElement("div");
		tempContainer.classList.add("adminContainer");

		let tempKey = document.createElement("p");
		tempKey.classList.add("adminKey");
		tempKey.innerText = key + ":";

		let tempText = document.createElement("p");
		tempText.innerText = String(plant[key]);

		tempContainer.appendChild(tempKey);
		tempContainer.appendChild(tempText);

		container.appendChild(tempContainer);
	}
}

export function createAdminUserUI(user){
	let container = document.getElementById("bottomPartContainer");
	container.innerHTML = "";

	let tempContainer = document.createElement("div");
	tempContainer.classList.add("adminContainer");

	let tempPic = document.createElement("img");
	tempPic.src = user.thumb;

	tempContainer.appendChild(tempPic);

	container.appendChild(tempContainer);

	for (let key in user) {
		if (key == "thumb") continue;
		let tempContainer = document.createElement("div");
		tempContainer.classList.add("adminContainer");

		let tempKey = document.createElement("p");
		tempKey.classList.add("adminKey");
		tempKey.innerText = key + ":";

		let tempText = document.createElement("p");
		tempText.innerText = String(user[key]);

		tempContainer.appendChild(tempKey);
		tempContainer.appendChild(tempText);

		container.appendChild(tempContainer);
	}
}

export function createShoppingCartUI() {
	let cart = JSON.parse(localStorage.cart);

	let fullContainer = document.getElementById("fullContainer");
	fullContainer.innerHTML = "";

	let topContainer = document.createElement("div");
	topContainer.classList.add("cartTopContainer");

	let checkOutButton = document.createElement("button");
	checkOutButton.innerText = "Gå til betaling";
	checkOutButton.addEventListener("click", function () {
		window.location.href = "checkout.html";
	});

	let tempTotal = 0;
	for (let i = 0; i < cart.length; i++) {
		for (let j = 0; j < cart[i][1]; j++) {
			tempTotal += cart[i][0].price;
		}
	}

	let totalPrice = document.createElement("h2");
	totalPrice.innerText = "Totalpris: kr " + tempTotal + ",-";

	let emptyButton = document.createElement("button");
	emptyButton.classList.add("emptyCartButton");
	emptyButton.innerText = "Tøm handlekurv";
	emptyButton.addEventListener("click", function () {
		emptyCart();
	});

	let line = document.createElement("hr");
	line.classList.add("line2");

	topContainer.appendChild(checkOutButton);
	topContainer.appendChild(totalPrice);
	topContainer.appendChild(emptyButton);

	fullContainer.appendChild(topContainer);
	fullContainer.appendChild(line);

	for (let i = 0; i < cart.length; i++) {
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
		minusButton.addEventListener("click", function () {
			changeCartPlant(i, false);
		});

		let plusButton = document.createElement("button");
		plusButton.classList.add("cartAmountButton");
		plusButton.innerText = "+";
		plusButton.addEventListener("click", function () {
			changeCartPlant(i, true);
		});

		numberOfPlantsContainer.appendChild(plantAmount);
		numberOfPlantsContainer.appendChild(minusButton);
		numberOfPlantsContainer.appendChild(plusButton);

		let plantPrice = document.createElement("p");
		plantPrice.innerText = "kr " + cart[i][0].price + ",-";

		let plantPriceTotal = document.createElement("p");
		plantPriceTotal.innerText = "Total pris: kr " + cart[i][0].price * cart[i][1] + ",-";

		let deleteButton = document.createElement("button");
		deleteButton.classList.add("removeFromCartButton");
		deleteButton.innerText = "Fjern fra kurv";
		deleteButton.addEventListener("click", function () {
			removePlantFromCart(i);
		});

		let line2 = document.createElement("hr");
		line2.classList.add("line2");

		plantContainer.appendChild(plantId);
		plantContainer.appendChild(plantName);
		plantContainer.appendChild(numberOfPlantsContainer);
		plantContainer.appendChild(plantPrice);
		plantContainer.appendChild(plantPriceTotal);
		if (cart[i][0].stock == 0) {
			let temp = new Date(cart[i][0].expected_shipped);
			let shippingText = document.createElement("p");
			shippingText.innerText = "Forventet på lager: " + temp.toString().substring(4, 15);

			plantContainer.appendChild(shippingText);
		}
		plantContainer.appendChild(deleteButton);

		fullContainer.appendChild(plantContainer);
		fullContainer.appendChild(line2);
	}

	document.getElementById("container").appendChild(fullContainer);
}

export async function createCheckoutUI() {
	let loginData;
	if (sessionStorage.loginData != undefined){
		loginData = JSON.parse(sessionStorage.loginData);
	}

	let fullContainer = document.getElementById("fullContainer2");

	let formContainer = document.createElement("div");
	formContainer.classList.add("formContainer");

	let shippingMethodContainer = document.createElement("div");
	shippingMethodContainer.classList.add("shippingMethodContainer");

	let confirmationContainer = document.createElement("div");
	confirmationContainer.classList.add("confirmationContainer");

	let customerForm = document.createElement("form");

	let customerNameLabel = document.createElement("label");
	customerNameLabel.innerText = "Navn:";

	let customerName = document.createElement("input");
	customerName.classList.add("checkoutInput");
	customerName.setAttribute("type", "text");
	customerName.setAttribute("name", "customer_name");
	customerName.setAttribute("id", "textField0");

	let streetLabel = document.createElement("label");
	streetLabel.innerText = "Gateadresse:";

	let street = document.createElement("input");
	street.classList.add("checkoutInput");
	street.setAttribute("type", "text");
	street.setAttribute("name", "street");
	street.setAttribute("id", "textField1");

	let cityLabel = document.createElement("label");
	cityLabel.innerText = "By:";

	let city = document.createElement("input");
	city.classList.add("checkoutInput");
	city.setAttribute("type", "text");
	city.setAttribute("name", "city");
	city.setAttribute("id", "textField2");

	let zipCodeLabel = document.createElement("label");
	zipCodeLabel.innerText = "Postnummer:";

	let zipCode = document.createElement("input");
	zipCode.classList.add("checkoutInput");
	zipCode.setAttribute("type", "text");
	zipCode.setAttribute("name", "zipcode");
	zipCode.setAttribute("id", "textField3");

	let countryLabel = document.createElement("label");
	countryLabel.innerText = "Land:";

	let country = document.createElement("input");
	country.classList.add("checkoutInput");
	country.setAttribute("type", "text");
	country.setAttribute("name", "country");
	country.setAttribute("id", "textField4");

	customerForm.appendChild(customerNameLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(customerName);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(streetLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(street);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(cityLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(city);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(zipCodeLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(zipCode);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(countryLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(country);

	formContainer.appendChild(customerForm);
	
	if (loginData != undefined){
		customerName.value = loginData.full_name;
		street.value = loginData.street;
		city.value = loginData.city;
		zipCode.value = loginData.zipcode;
		country.value = loginData.country;
	}

	let shippingMethods = await getShippingMethods();

	for (let i = 0; i < shippingMethods.length; i++) {
		let tempShippingMethod = document.createElement("input");
		tempShippingMethod.setAttribute("type", "radio");
		tempShippingMethod.setAttribute("name", "shipping");
		tempShippingMethod.setAttribute("id", "shippingOption" + i);

		let tempShippingMethodLabel = document.createElement("label");
		tempShippingMethodLabel.innerText = shippingMethods[i].method + ": " + shippingMethods[i].description + " kr " + shippingMethods[i].price + ",-";

		shippingMethodContainer.appendChild(tempShippingMethod);
		shippingMethodContainer.appendChild(tempShippingMethodLabel);
		shippingMethodContainer.appendChild(document.createElement("br"));
	}

	let cart = JSON.parse(localStorage.cart);

	let tempTotal = 0;
	for (let i = 0; i < cart.length; i++) {
		for (let j = 0; j < cart[i][1]; j++) {
			tempTotal += cart[i][0].price;
		}
	}

	let totalPrice = document.createElement("h3");
	totalPrice.innerText = "Totalpris: kr " + tempTotal + ",-";

	let confirmationButton = document.createElement("button");
	confirmationButton.innerText = "Bekreft ordre";
	confirmationButton.addEventListener("click", async function () {
		let text = false;
		let radio = false;

		for (let i = 0; i < 4; i++) {
			if (document.getElementById("textField" + i).value == "") {
				alert("Vennligst fyll inn alle feltene.");

				return;
			}
		}
		text = true;

		if (
			document.getElementById("shippingOption0").checked ||
			document.getElementById("shippingOption1").checked ||
			document.getElementById("shippingOption2").checked ||
			document.getElementById("shippingOption3").checked
		) {
			radio = true;
		} else {
			alert("Vennligst velg en shipping method.");

			return;
		}

		if (radio && text) {
			let orderData = {};

			for (let i = 0; i < 5; i++) {
				orderData[document.getElementById("textField" + i).name] = document.getElementById("textField" + i).value;
			}

			for (let i = 0; i < 4; i++) {
				if (document.getElementById("shippingOption" + i).checked) {
					//Her tar vi +1 for å converte til riktig ID (indexen i arrayen er 0 - 3, idene er 1 - 4)
					orderData["shipping_id"] = i + 1;
				}
			}

			let tempCart = JSON.parse(localStorage.cart);
			let tempArr = [];

			for (let i = 0; i < tempCart.length; i++) {
				let tempPlant = { id: null, amount: null };
				tempPlant.id = tempCart[i][0].id;
				tempPlant.amount = tempCart[i][1];
				tempArr.push(tempPlant);
			}

			orderData["content"] = tempArr;

			let order = await sendOrder(JSON.stringify(orderData));
			//if ((order.msg == "insert order ok") && (order != undefined)){
			if (order != undefined) {
				localStorage.orderData = JSON.stringify(order);
				window.location.href = "confirmation.html";
			} else {
				alert("Noe gikk galt");
			}
		}
	});

	confirmationContainer.appendChild(totalPrice);
	confirmationContainer.appendChild(document.createElement("br"));
	confirmationContainer.appendChild(confirmationButton);

	fullContainer.appendChild(formContainer);
	fullContainer.appendChild(shippingMethodContainer);
	fullContainer.appendChild(confirmationContainer);
}

export async function createConfirmationUI() {
	let orderConfirmation = JSON.parse(localStorage.orderData);

	let container = document.getElementById("fullContainer3");

	let confirmationText = document.createElement("h2");
	confirmationText.innerText = "Orderen din er bekreftet!";

	container.appendChild(confirmationText);

	for (let key in orderConfirmation["record"]) {
		if (key == "content" || key == "completed" || key == "completed_date") continue;
		let tempText = document.createElement("p");
		if (key == "shipping_id") {
			let shippingMethods = await getShippingMethods();

			//Her tar vi -1 på IDen vi sendte (og da fikk tilbake) for å få riktig index i arrayen
			tempText.innerText =
				key + ": " + shippingMethods[orderConfirmation["record"][key] - 1].method + ", " + shippingMethods[orderConfirmation["record"][key] - 1].description;
		} else if (key == "date") {
			tempText.innerText = key + ": " + orderConfirmation["record"][key].substring(0, 10);
		} else {
			tempText.innerText = key + ": " + String(orderConfirmation["record"][key]);
		}

		container.appendChild(tempText);
	}

	let tempCart = JSON.parse(localStorage.cart);

	for (let i = 0; i < tempCart.length; i++) {
		let tempPlantId = document.createElement("p");
		tempPlantId.innerText = "Plante id: " + tempCart[i][0].id;

		let tempPlantName = document.createElement("p");
		tempPlantName.innerText = "Plante navn: " + tempCart[i][0].name;

		let tempPlantTotal = document.createElement("p");
		tempPlantTotal.innerText = "Plante antall: " + tempCart[i][1];

		let tempPlantPrice = document.createElement("p");
		tempPlantPrice.innerText = "Plante pris: " + tempCart[i][0].price;

		let tempPlantPriceTotal = document.createElement("p");
		tempPlantPriceTotal.innerText = "Plante total pris: " + tempCart[i][0].price * tempCart[i][1];

		container.appendChild(document.createElement("br"));
		container.appendChild(tempPlantId);
		container.appendChild(tempPlantName);
		container.appendChild(tempPlantTotal);
		container.appendChild(tempPlantPrice);
		container.appendChild(tempPlantPriceTotal);
	}
}

export async function createAdminOrderUI(token) {
	let orders = await getOrder(token);

	let wrapper = document.getElementById("orderWrapper");

	for (let i = 0; i < orders.length; i++) {
		let tempOrderContainer = document.createElement("div");
		tempOrderContainer.classList.add("orderContainer");

		for (let key in orders[i]) {
			let tempText = document.createElement("p");
			tempText.innerText = key + ": " + String(orders[i][key]);

			tempOrderContainer.appendChild(tempText);
		}

		let deleteButton = document.createElement("button");
		deleteButton.innerText = "Slett order";
		deleteButton.addEventListener("click", async function () {
			await deleteOrder(token, orders[i].id);

			location.reload();
		});

		let line = document.createElement("hr");

		tempOrderContainer.appendChild(deleteButton);
		tempOrderContainer.appendChild(line);
		wrapper.appendChild(tempOrderContainer);
	}
}

export function createHeaderUserUI() {
	let container = document.getElementById("headerContainer");

	let loginData;
	if (sessionStorage.loginData == undefined){
		let loginButton = document.createElement("button");
		loginButton.addEventListener("click", function () {
			window.location.href = "login.html";
		})
		loginButton.classList.add("headerButton");
		loginButton.innerText = "Login";

		let registerButton = document.createElement("button");
		registerButton.addEventListener("click", function () {
			window.location.href = "register.html";
		})
		registerButton.classList.add("headerButton");
		registerButton.innerText = "Register";

		container.appendChild(loginButton);
		container.appendChild(registerButton);
	}
	else {
		loginData = JSON.parse(sessionStorage.loginData);

		let profilePic = document.createElement("img");
		profilePic.classList.add("profilePic");
		profilePic.src = loginData.thumb;

		let logoutButton = document.createElement("button");
		logoutButton.classList.add("headerButton");
		logoutButton.innerText = "Logout";
		logoutButton.addEventListener("click", function(){
			sessionStorage.removeItem("loginData");

			window.location.href = "logoutConfirmation.html";
		})

		container.appendChild(logoutButton);
		container.appendChild(profilePic);
	}
}

export function createRegisterUI() {
	let fullContainer = document.getElementById("fullContainer2");

	let formContainer = document.createElement("div");
	formContainer.classList.add("formContainer");

	let customerForm = document.createElement("form");

	let usernameLabel = document.createElement("label");
	usernameLabel.innerText = "Brukernavn:";

	let username = document.createElement("input");
	username.classList.add("checkoutInput");
	username.setAttribute("type", "text");
	username.setAttribute("name", "username");
	username.setAttribute("id", "textField0");

	let passwordLabel = document.createElement("label");
	passwordLabel.innerText = "Passord:";

	let password = document.createElement("input");
	password.classList.add("checkoutInput");
	password.setAttribute("type", "password");
	password.setAttribute("name", "password");
	password.setAttribute("id", "textField1");

	let customerNameLabel = document.createElement("label");
	customerNameLabel.innerText = "Navn:";

	let customerName = document.createElement("input");
	customerName.classList.add("checkoutInput");
	customerName.setAttribute("type", "text");
	customerName.setAttribute("name", "fullname");
	customerName.setAttribute("id", "textField2");

	let streetLabel = document.createElement("label");
	streetLabel.innerText = "Gateadresse:";

	let street = document.createElement("input");
	street.classList.add("checkoutInput");
	street.setAttribute("type", "text");
	street.setAttribute("name", "street");
	street.setAttribute("id", "textField3");

	let cityLabel = document.createElement("label");
	cityLabel.innerText = "By:";

	let city = document.createElement("input");
	city.classList.add("checkoutInput");
	city.setAttribute("type", "text");
	city.setAttribute("name", "city");
	city.setAttribute("id", "textField4");

	let zipCodeLabel = document.createElement("label");
	zipCodeLabel.innerText = "Postnummer:";

	let zipCode = document.createElement("input");
	zipCode.classList.add("checkoutInput");
	zipCode.setAttribute("type", "text");
	zipCode.setAttribute("name", "zipcode");
	zipCode.setAttribute("id", "textField5");

	let countryLabel = document.createElement("label");
	countryLabel.innerText = "Land:";

	let country = document.createElement("input");
	country.classList.add("checkoutInput");
	country.setAttribute("type", "text");
	country.setAttribute("name", "country");
	country.setAttribute("id", "textField6");

	let imageLabel = document.createElement("label");
	imageLabel.innerText = "Profil bilde:";

	let image = document.createElement("input");
	image.classList.add("checkoutInput");
	image.setAttribute("type", "file");
	image.setAttribute("name", "img_file");
	image.setAttribute("accept", "image/jpeg, image/png, image/jpg");
	image.setAttribute("id", "imageField");

	let confirmationButton = document.createElement("input");
	confirmationButton.setAttribute("type", "submit");
	confirmationButton.setAttribute("value", "Registrer Bruker");
	confirmationButton.setAttribute("id", "submitFormButton");

	customerForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		for (let i = 0; i < 6; i++) {
			if (document.getElementById("textField" + i).value == "") {
				alert("Vennligst fyll inn alle feltene.");

				return;
			}
		}

		let formData = new FormData(customerForm);
		await registerUser(formData);

		window.location.href = "registerConfirmation.html";
	})

	customerForm.appendChild(usernameLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(username);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(passwordLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(password);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(customerNameLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(customerName);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(streetLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(street);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(cityLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(city);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(zipCodeLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(zipCode);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(countryLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(country);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(imageLabel);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(image);
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(document.createElement("br"));
	customerForm.appendChild(confirmationButton);

	formContainer.appendChild(customerForm);

	fullContainer.appendChild(formContainer);
}

export function createLoginUI() {
	let container = document.getElementById("fullContainer2");

	let loginForm = document.createElement("form");
	loginForm.setAttribute("id", "userLoginForm");

	let usernameLabel = document.createElement("label");
	usernameLabel.innerText = "Brukernavn:";

	let username = document.createElement("input");
	username.classList.add("checkoutInput");
	username.setAttribute("type", "text");
	username.setAttribute("name", "username");
	username.setAttribute("id", "username");

	let passwordLabel = document.createElement("label");
	passwordLabel.innerText = "Passord:";

	let password = document.createElement("input");
	password.classList.add("checkoutInput");
	password.setAttribute("type", "password");
	password.setAttribute("name", "street");
	password.setAttribute("id", "password");

	let loginButton = document.createElement("input");
	loginButton.setAttribute("type", "submit");
	loginButton.setAttribute("value", "Login");
	loginButton.setAttribute("id", "loginButton");

	loginForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		if (username.value == "") return
		if (password.value == "") return

		let login = await loginUser(username.value, password.value);

		if (login != undefined){
			sessionStorage.loginData = JSON.stringify(login.logindata);

			window.location.href = "loginConfirmation.html";
		}
	})

	loginForm.appendChild(usernameLabel);
	loginForm.appendChild(document.createElement("br"));
	loginForm.appendChild(username);
	loginForm.appendChild(document.createElement("br"));
	loginForm.appendChild(passwordLabel);
	loginForm.appendChild(document.createElement("br"));
	loginForm.appendChild(password);
	loginForm.appendChild(document.createElement("br"));
	loginForm.appendChild(document.createElement("br"));
	loginForm.appendChild(loginButton);

	container.appendChild(loginForm);
}