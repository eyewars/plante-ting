"use strict";

let key = "key=OLMALY81";
let categoryUrl = "https://helseflora.herokuapp.com/webshop/categories";
let plantViewUrl = "https://helseflora.herokuapp.com/webshop/plants?";
let detailViewUrl = "https://helseflora.herokuapp.com/webshop/plants?id=";
let plantZoneUrl = "https://helseflora.herokuapp.com/botany/plantzones";

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

export async function getPlantViewData(category, searchByCategory) {
    try {
        let response;
        if (searchByCategory){
            response = await fetch(plantViewUrl + "category=" + (await getCategoryData(category)) + "&" + key);
        }
        else{
            response = await fetch(plantViewUrl + key);
        }

        //console.log(await fetch(plantViewUrl + key));

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

export async function getDetailViewData(id) {
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

export async function getPlantZoneData(id) {
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