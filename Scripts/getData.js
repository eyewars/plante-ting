"use strict";

let key = "key=OLMALY81";
let categoryUrl = "https://helseflora.herokuapp.com/webshop/categories";
let plantViewUrl = "https://helseflora.herokuapp.com/webshop/plants?";
let detailViewUrl = "https://helseflora.herokuapp.com/webshop/plants?id=";
let plantZoneUrl = "https://helseflora.herokuapp.com/botany/plantzones";
let adminLoginUrl = "https://helseflora.herokuapp.com/users/adminlogin";

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
    if (searchByCategory) {
      response = await fetch(plantViewUrl + "category=" + (await getCategoryData(category)) + "&" + key);
    } else {
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

function createBasicAuthString(username, password) {
  let combinedStr = username + ":" + password;
  let b64Str = btoa(combinedStr);
  return "basic " + b64Str; //return the basic authentication string
}

let username = "carlvonlinne@helseflora.no";
let password = "pollendust";

/* 
Vi brukte chatGPT for å finne ut hvordan vi kunne sjekke admin login mot server for å kunne gjøre endringer. 

Input var punkt 5 fra dokumentasjonen og "I have to log into a server as an administrator to change, add, or remove things on it. This is how it's described in the documentation, how would you go about logging in? Use javascript."
*/
export async function getAuthenticationToken() {
  let basicAuthString = createBasicAuthString(username, password);

  let headers = new Headers();
  headers.append("authorization", basicAuthString);
  //Den sa dette ville fikse erroren, men det funka ikke
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const requestData = new URLSearchParams();
  requestData.append("key", "OLMALY81");

  let requestOptions = {
    method: "POST",
    headers,
    //Den sa også at å adde .toString() ville fikse det, men det gjorde det ikke
    body: requestData.toString(),
  };

  try {
    let response = await fetch(adminLoginUrl, requestOptions);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I getAuthenticationToken()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}
