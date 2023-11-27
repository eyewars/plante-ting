"use strict";

import { createShoppingCartUI } from "./createUI.js";

let cart = [];

export function addToCart(plant) {
    if (localStorage.cart != null) {
        cart = JSON.parse(localStorage.cart);
    }
    let plantId = plant.id;

    for (let i = 0; i < cart.length; i++) {
        if (plantId == cart[i][0].id) {
            cart[i][1]++;

            localStorage.cart = JSON.stringify(cart);
            return;
        }
    }

    let tempPlant = [plant, 1];
    cart.push(tempPlant);
  
    localStorage.cart = JSON.stringify(cart);
}

export function changeCartPlant(plantIndex, add) {
    cart = JSON.parse(localStorage.cart);

    if (add) {
        cart[plantIndex][1]++;
    }
    else if (cart[plantIndex][1] == 1) {
        return;
    }
    else cart[plantIndex][1]--;

    localStorage.cart = JSON.stringify(cart);

    createShoppingCartUI();
}

export function removePlantFromCart(plantIndex) {
    cart = JSON.parse(localStorage.cart);

    cart.splice(plantIndex, 1)

    localStorage.cart = JSON.stringify(cart);

    createShoppingCartUI();
}

export function emptyCart() {
    localStorage.cart = JSON.stringify([]);
    createShoppingCartUI();
}