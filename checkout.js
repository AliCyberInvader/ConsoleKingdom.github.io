document.addEventListener("DOMContentLoaded", function () {
  refreshCheckout();

  const outsideLebanonRadio = document.getElementById("outside-lebanon");
  const insideLebanonRadio = document.getElementById("inside-lebanon");
  const countryContainer = document.getElementById("country-container");
  const governorate = document.getElementById("governorate");

  const countries = {
      "countries": [
          "United States", "Canada", "United Kingdom", "Germany", "France"
          // Add more countries as needed
      ]
  };

  outsideLebanonRadio.addEventListener("change", () => {
      governorate.style.display = "none";
      document.getElementById("gov-text").style.display = "none";
      countryContainer.style.display = "block";
      populateCountryDropdown();
  });

  insideLebanonRadio.addEventListener("change", () => {
      governorate.style.display = "block";
      document.getElementById("gov-text").style.display = "block";
      countryContainer.style.display = "none";
  });

  document.getElementById("checkout-form").addEventListener("submit", function (event) {
      event.preventDefault();
      if (validateForm()) {
        downloadJSON(event);
        setTimeout(()=>{
         
          localStorage.removeItem('totalQuantity');
          localStorage.removeItem('checkoutItems');
          localStorage.removeItem('receiptData');
          localStorage.removeItem('bundlesTotalQuantity');
          localStorage.removeItem('bundleCheckoutItems');
          localStorage.removeItem('bundlesArr');
          localStorage.removeItem('console');
          localStorage.removeItem('productsArr');
          localStorage.removeItem('bundlesFinalTotal');
          localStorage.removeItem('finalTotal');
          window.location.replace("index.html");},2000)

      }
  });

  function validateForm() {
      let isValid = true;
      clearErrors();

      const fullName = document.getElementById("full_name").value;
      const phoneNumber = document.getElementById("phone_number").value;
      const address = document.getElementById("address").value;
      const shippingMethod = document.querySelector('input[name="shipping"]:checked');
      const country = document.getElementById("country").value;

      if (!fullName) {
          isValid = false;
          document.getElementById("name-error").textContent = "Full name is required.";
      }

      if (!phoneNumber) {
          isValid = false;
          document.getElementById("phone-error").textContent = "Phone number is required.";
      } else if (!/^\d{5,16}$/.test(phoneNumber)) {
          isValid = false;
          document.getElementById("phone-error").textContent = "Phone number must be between 5 and 16 digits, with no spaces or special characters.";
      }

      if (!address) {
          isValid = false;
          document.getElementById("address-error").textContent = "Address is required.";
      }

      if (shippingMethod && shippingMethod.value === "outside-lebanon" && !country) {
          isValid = false;
          document.getElementById("country-error").textContent = "Please select a country.";
      }

      return isValid;
  }

  function clearErrors() {
      document.getElementById("name-error").textContent = "";
      document.getElementById("phone-error").textContent = "";
      document.getElementById("address-error").textContent = "";
      document.getElementById("country-error").textContent = "";
  }

  function populateCountryDropdown() {
      const countrySelect = document.getElementById("country");
      countrySelect.innerHTML = ""; // Clear existing options

      countries.countries.forEach(function (country) {
          const option = document.createElement("option");
          option.value = country;
          option.textContent = country;
          countrySelect.appendChild(option);
      });
  }
});

function addItems() {
  let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
  let totalQuantity = Number(localStorage.getItem("totalQuantity")) || 0;
  let finalTotal = Number(localStorage.getItem("finalTotal")) || 0;
  let bundlesFinalTotal = Number(localStorage.getItem("bundlesFinalTotal")) || 0;
  let total = finalTotal + bundlesFinalTotal;
  let bundlesTotalQuantity = Number(localStorage.getItem("bundlesTotalQuantity")) || 0;
  const outsideLebanonRadio = document.getElementById("outside-lebanon");
  const insideLebanonRadio = document.getElementById("inside-lebanon");

  insideLebanonRadio.addEventListener("change", () => {
      document.getElementById("total-price").innerHTML = `${total.toFixed(2)}$ <br> Including Shipping`;
      document.getElementById("governorate").style.display = "block";
      document.getElementById("gov-text").style.display = "block";
  });

  outsideLebanonRadio.addEventListener("change", () => {
      let newTotal = total + 35.0;
      document.getElementById("governorate").style.display = "none";
      document.getElementById("gov-text").style.display = "none";
      document.getElementById("total-price").innerHTML = `${newTotal.toFixed(2)}$ <br> Including Shipping`;
  });

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

  document.getElementById("total-quantity").textContent = totalQuantity + bundlesTotalQuantity;
  document.getElementById("total-price").innerHTML = `${total.toFixed(2)}$ <br> Including Shipping`;
}

// Function to add bundle items to the list of products
function addBundlesItems() {
  let bundleCheckoutItems = JSON.parse(localStorage.getItem("bundleCheckoutItems")) || [];

  if (bundleCheckoutItems.length === 0) {
      console.log("No bundle items found in local storage.");
      return;
  }

  console.log("Adding bundle items...");

  let listOfProducts = document.querySelector(".list-product");

  bundleCheckoutItems.forEach((checkoutItem) => {
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
      totalPriceDiv.textContent = `${checkoutItem.bundlesTotalItemPrice}$`;
      productDiv.appendChild(totalPriceDiv);

      let typeDiv = document.createElement("div");
      typeDiv.classList.add("type");
      typeDiv.textContent = checkoutItem.platform;
      productDiv.appendChild(typeDiv);
  });
}

function makeArray() {
  let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
  let bundleCheckoutItems = JSON.parse(localStorage.getItem("bundleCheckoutItems")) || [];

  let receiptData = [...checkoutItems, ...bundleCheckoutItems].map((item) => {
      // Create a new object excluding unwanted fields
      const { id, name, platform, quantity, price } = item;
      return { id, name, platform, quantity, price };
  });

  localStorage.setItem("receiptData", JSON.stringify(receiptData));
}

function downloadJSON(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  makeArray();

  // Get form data
  const form = document.getElementById("checkout-form");
  const formData = new FormData(form);

  const fullName = formData.get("full_name");
  const phoneNumber = formData.get("phone_number");
  const address = formData.get("address");

  // Get data from localStorage
  const receiptData = localStorage.getItem("receiptData");
  let totalQuantity = Number(localStorage.getItem("totalQuantity")) || 0;
  let finalTotal = Number(localStorage.getItem("finalTotal")) || 0;
  let bundlesFinalTotal = Number(localStorage.getItem("bundlesFinalTotal")) || 0;
  let bundlesTotalQuantity = Number(localStorage.getItem("bundlesTotalQuantity")) || 0;

  let finalQuantity = totalQuantity + bundlesTotalQuantity;

  // Check the selected radio button and adjust the final price and customer info accordingly
  const outsideLebanonRadio = document.getElementById("outside-lebanon");
  const insideLebanonRadio = document.getElementById("inside-lebanon");
  let finalPrice;
  let customerInfo;
  const paymentMethod = formData.get("paymentMethod");

  if (insideLebanonRadio.checked) {
      finalPrice = finalTotal + bundlesFinalTotal;

      // Include governorate field for customers inside Lebanon
      const governorate = formData.get("governorate");
      customerInfo = {
          fullName: fullName,
          phoneNumber: phoneNumber,
          address: address,
          governorate: governorate.toUpperCase(),
      };
  } else if (outsideLebanonRadio.checked) {
      finalPrice = finalTotal + bundlesFinalTotal + 35.0;

      // Exclude governorate field for customers outside Lebanon
      customerInfo = {
          fullName: fullName,
          phoneNumber: phoneNumber,
          address: address,
      };
  } else {
      // Handle case where neither radio button is selected
      alert("Please select a delivery location.");
      return;
  }

  // Check if data exists in localStorage
  if (!receiptData || !totalQuantity || !finalTotal) {
      alert("No data found in localStorage.");
      return;
  }

  // Create a JSON object
  const jsonData = {
      items: JSON.parse(receiptData),
      totalQuantity: Number(finalQuantity),
      finalTotal: finalPrice.toFixed(2),
      paymentMethod: paymentMethod,
      customerInfo: customerInfo,
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

// Function to refresh the checkout page by reloading data from local storage
function refreshCheckout() {
  console.log("Refreshing checkout...");

  // Add items and bundles to the checkout
  addItems();
  addBundlesItems();
}

// Listen for messages from the cart page
window.addEventListener("message", function (event) {
  if (event.data.type === "updateCheckout") {
      refreshCheckout();
  }
});

// Also, listen to changes in local storage to auto-refresh the checkout page
window.addEventListener("storage", function (event) {
  if (
      event.key === "checkoutItems" ||
      event.key === "totalQuantity" ||
      event.key === "finalTotal" ||
      event.key === "bundleCheckoutItems"
  ) {
      refreshCheckout();
  }
});

// Initial load when checkout page is opened
document.addEventListener("DOMContentLoaded", function () {
  refreshCheckout();
});
