// function to add items to the list of products
function addItems() {
  let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
  let totalQuantity = localStorage.getItem("totalQuantity");
  let finalTotal = localStorage.getItem("finalTotal");

  let listOfProducts = document.querySelector(".list-product");
  listOfProducts.innerHTML = "";
  let h1 = document.createElement("h1");
  h1.innerHTML = "List of Products";
  listOfProducts.appendChild(h1);
  checkoutItems.forEach((checkoutItem) => {
    let productDiv = document.createElement("div");
    productDiv.classList.add("product");
    listOfProducts.appendChild(productDiv);

    let infoDiv = document.createElement("div");
    infoDiv.classList.add("info");
    productDiv.appendChild(infoDiv);

    let nameDiv = document.createElement("div");
    nameDiv.classList.add("name");
    nameDiv.textContent = checkoutItem.name;
    infoDiv.appendChild(nameDiv);

    let priceDiv = document.createElement("div");
    priceDiv.classList.add("price");
    priceDiv.textContent = `${checkoutItem.price}$ per disc`;
    infoDiv.appendChild(priceDiv);

    let quantityDiv = document.createElement("div");
    quantityDiv.classList.add("quantity");
    quantityDiv.textContent = checkoutItem.quantity;
    productDiv.appendChild(quantityDiv);

    let totalPriceDiv = document.createElement("div");
    totalPriceDiv.classList.add("total-price");
    totalPriceDiv.textContent = `${checkoutItem.totalItemPrice}$`;
    productDiv.appendChild(totalPriceDiv);

    let typeDiv = document.createElement("div");
    typeDiv.classList.add("type");
    typeDiv.textContent = checkoutItem.platform;
    productDiv.appendChild(typeDiv);
  });

  document.getElementById("total-quantity").textContent = totalQuantity;
  document.getElementById(
    "total-price"
  ).innerHTML = `${finalTotal}$ <br> Including Delivery`;
}

// function to download info in a json file
function downloadJSON(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get form data
  const form = document.getElementById("checkout-form");
  const formData = new FormData(form);

  const fullName = formData.get("full_name");
  const phoneNumber = formData.get("phone_number");
  const address = formData.get("address");
  const governorate = formData.get("governorate");

  // Validate form data
  if (!fullName || !phoneNumber || !address || !governorate) {
    alert("Please fill out all form fields before proceeding.");
    return;
  }

  // Get data from localStorage
  const checkoutItems = localStorage.getItem("checkoutItems");
  const totalQuantity = localStorage.getItem("totalQuantity");
  const finalTotal = localStorage.getItem("finalTotal");

  // Check if data exists in localStorage
  if (!checkoutItems || !totalQuantity || !finalTotal) {
    alert("No data found in localStorage.");
    return;
  }

  // Create a JSON object
  const jsonData = {
    checkoutItems: JSON.parse(checkoutItems),
    totalQuantity: totalQuantity,
    finalTotal: finalTotal,
    formData: {
      fullName: fullName,
      phoneNumber: phoneNumber,
      address: address,
      governorate: governorate,
    },
  };

  // Convert the JSON object to a string
  const jsonString = JSON.stringify(jsonData, null, 2); // Pretty-print JSON

  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a link element
  const link = document.createElement("a");

  // Set the download attribute with a filename
  link.download = "checkout-data.json";

  // Create a URL for the Blob and set it as the href
  link.href = URL.createObjectURL(blob);

  // Append the link to the document
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
}

addItems();
window.addEventListener("storage", function (event) {
  if (
    event.key === "checkoutItems" ||
    event.key === "totalQuantity" ||
    event.key === "finalTotal"
  ) {
    updateCheckout();
  }
});
// Function to handle updates and refresh checkout page
function refreshCheckout() {
  addItems();
}

// Listen for messages from the cart page
window.addEventListener("message", function (event) {
  if (event.data.type === "updateCheckout") {
    refreshCheckout();
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", function () {
  refreshCheckout(); // Load the checkout items when the page first loads
});

// Handle `storage` event to refresh checkout if needed
window.addEventListener("storage", function (event) {
  if (
    event.key === "checkoutItems" ||
    event.key === "totalQuantity" ||
    event.key === "finalTotal"
  ) {
    refreshCheckout();
  }
});
