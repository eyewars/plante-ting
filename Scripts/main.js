"use strict";
//OLMALY81
let key = "key=OLMALY81";
let categoryUrl = "https://helseflora.herokuapp.com/webshop/categories";
let plantViewUrl = "https://helseflora.herokuapp.com/webshop/plants?category=";
let detailViewUrl = "https://helseflora.herokuapp.com/webshop/plants?id=";
let plantZoneUrl = "https://helseflora.herokuapp.com/botany/plantzones";

async function getCategoryData(category) {
    try {
        let response = await fetch(categoryUrl + "?" + key);

        if (response.status != 200) {
            console.log("DET ER EN FEIL I getCategoryData()")
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
        console.log(plantZoneUrl + "?" + key);

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

function plantViewUI(plantArr, fromSearch) {
    if (plantArr[0] == null) {
        const noPlantText = document.createElement("h2");
        noPlantText.innerText = "Your search did not match any plants";

        document.getElementById("container").appendChild(noPlantText);
    }
    else {
        for (let plant of plantArr) {
            console.log(plant);
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
        }
        else document.getElementById("planteKategori").innerText = "Not categorized";
    }

}

function detailViewUI(detail, zone) {
    console.log(zone);
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

    // HER HER FIKS HER LOL
    const categoryText = document.createElement("p");
    categoryText.innerText = "Kategori: " + detail.category_name;
    // HER HER FIKS HER LOL

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

    textContainer.appendChild(height);
    textContainer.appendChild(vekstsone);
    textContainer.appendChild(vekstsoneDescr);
    textContainer.appendChild(mix);

    picTextContainer.appendChild(picText);

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

    document.getElementById("container").appendChild(detailContainer);
}

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
        if (!window.location.href.includes("searchType")) {
            let category = new URLSearchParams(window.location.search).get("category");
            plantViewUI(await getPlantViewData(category));
        }
        else {
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
