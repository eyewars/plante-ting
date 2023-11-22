"use strict";

let key = "key=OLMALY81";
let categoryUrl = "https://helseflora.herokuapp.com/webshop/categories";
let plantViewUrl = "https://helseflora.herokuapp.com/webshop/plants?";
let detailViewUrl = "https://helseflora.herokuapp.com/webshop/plants?id=";
let plantZoneUrl = "https://helseflora.herokuapp.com/botany/plantzones";
let adminLoginUrl = "https://helseflora.herokuapp.com/users/adminlogin";
let shippingMethodsUrl =  "https://helseflora.herokuapp.com/logistics/shippingtypes";
let ordersUrl = "https://helseflora.herokuapp.com/webshop/orders";
let userUrl =  "https://helseflora.herokuapp.com/users?";
let loginUrl =  "https://helseflora.herokuapp.com/users/login?";

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

export async function getPlantViewData(category, searchByCategory, token) {
  let requestOptions = {
    method: "GET",
    headers: {
      authorization: token,
    },
  }
  try {
    let response;
    if (searchByCategory) {
      response = await fetch(plantViewUrl + "category=" + (await getCategoryData(category)) + "&" + key);
    } else {
      response = await fetch(plantViewUrl + key, requestOptions);
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

export async function getAuthenticationToken(username, password) {
  let basicAuthString = createBasicAuthString(username, password);

  let requestOptions = {
    method: "POST",
    headers: {
      authorization: basicAuthString,
    },
  };

  try {
    let response = await fetch(adminLoginUrl + "?" + key, requestOptions);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I getAuthenticationToken()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    //console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function addChangePlantData(token, formData, postOrPut){
  let requestOptions = {
    method: postOrPut,
    headers: {
      authorization: token,
    },
    body: formData,
  }
  try{
    let response = await fetch(plantViewUrl + key, requestOptions);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I addChangePlantData()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    console.log(data);

    return data;
  } catch(error){
    console.log(error);
  }
}

export async function getShippingMethods(){
  try {
    let response = await fetch(shippingMethodsUrl + "?" + key);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I getShippingMethods()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    //console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function sendOrder(order){
  let requestOptions = {
    method: "POST",
    headers: {
      //HER SKAL DU KUNNE PUTTE INN BRUKER ID NÅR MAN LOGGER INN
      //authorization: "",
      "Content-Type": "application/json",
    },
    body: order,
  }
  try {
    let response = await fetch(ordersUrl + "?" + key, requestOptions);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I sendOrder()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    //console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getOrder(token){
  let requestOptions = {
    method: "GET",
    headers: {
      authorization: token,
    },
  }
  try {
    let response = await fetch(ordersUrl + "?" + key, requestOptions);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I getOrder()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    //console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteOrder(token, orderId){
  let requestOptions = {
    method: "DELETE",
    headers: {
      authorization: token,
    },
  }
  try {
    let response = await fetch(ordersUrl + "?" + key + "&id=" + orderId, requestOptions);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I deleteOrder()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function registerUser(formData){
  let requestOptions = {
    method: "POST",
    body: formData,
  }
  try{
    let response = await fetch(userUrl + key, requestOptions);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I registerUser()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    //console.log(data);

    return data;
  } catch(error){
    console.log(error);
  }
}

export async function loginUser(username, password){
  let basicAuthString = createBasicAuthString(username, password);

  let requestOptions = {
    method: "POST",
    headers: {
      authorization: basicAuthString,
    },
  };

  try {
    let response = await fetch(loginUrl + key, requestOptions);

    if (response.status != 200) {
      console.log("DET ER EN FEIL I loginUser()");
      throw new Error("Server error: " + response.status);
    }

    let data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}