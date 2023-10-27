"use strict";

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

// carlvonlinne@helseflora.no
// pollendust
