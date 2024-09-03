document.addEventListener("DOMContentLoaded", async () => {
    try {
      const bundleResponse = await fetch("data/bundles.json");
      const resBndl = await bundleResponse.json();
      const bundlesData = resBndl.bundles;
  
      const productsResponse = await fetch("data/products.json");
      const resPrdt = await productsResponse.json();
      const productsData = resPrdt.games;
  
      console.log("Fetched Bundles Data:", bundlesData);
      console.log("Fetched Products Data:", productsData);
  
      // Store initial data in memory for consistency
      window.bundlesData = bundlesData;
      window.productsData = productsData;
  
      // Display the cart items
      displayCartItems(bundlesData, productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
  
  const cartArray = JSON.parse(localStorage.getItem("productsArr")) || [];
  const bundlesArray = JSON.parse(localStorage.getItem("bundlesArr")) || [];
  
  console.log("Cart Array:", cartArray);
  console.log("Bundles Array:", bundlesArray);
  
  function displayCartItems(bundlesData, productsData) {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = "";
  
    let totalQuantity = 0;
    let totalPrice = 0;
  
    // Process cart items
    cartArray.forEach((cartItem) => {
      const product = productsData.find(
        (item) => item.id === parseInt(cartItem.nb)
      );
      if (product) {
        const platform = product.platforms.find(
          (p) => p.type.toLowerCase() === cartItem.type.toLowerCase()
        );
        if (platform) {
          const itemTotalPrice = platform.price * cartItem.occurrence;
  
          totalQuantity += cartItem.occurrence;
          totalPrice += itemTotalPrice;
  
          cartContainer.innerHTML += `
                    <div class="cart-item">
                        <img src="${platform.image}" alt="${product.name}">
                        <h4>${product.name} (${cartItem.type.toUpperCase()})</h4>
                        <p>Price: $${platform.price}</p>
                        <p>Quantity: 
                            <button class="qun" onclick="updateQuantity(${cartItem.nb}, '${
            cartItem.type
          }', -1)">-</button>
                            ${cartItem.occurrence}
                            <button class="qun" onclick="updateQuantity(${cartItem.nb}, '${
            cartItem.type
          }', 1)">+</button>
                        </p>
                        <p>Subtotal: $${itemTotalPrice.toFixed(2)}</p>
                        <div>
                        <button id="remove" onclick="removeItem(${cartItem.nb}, '${
            cartItem.type
          }')">Remove</button>
            </div>
                    </div>
                `;
        }
      }
    });
  
    // Process bundle items
    bundlesArray.forEach((bundleItem) => {
      const bundle = bundlesData.find(
        (item) => item.id === parseInt(bundleItem.id)
      );
      if (bundle) {
        const bundleTotalPrice = bundle.price * bundleItem.occurrence;
  
        totalQuantity += bundleItem.occurrence;
        totalPrice += bundleTotalPrice;
  
        cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${bundle.image}" alt="${bundle.name}">
                    <h4>${bundle.name} (${bundle.type.toUpperCase()})</h4>
                    <p>Price: $${bundle.price}</p>
                    <p>Quantity: 
                        <button class="qun" onclick="updateBundleQuantity(${
                          bundleItem.id
                        }, -1)">-</button>
                        ${bundleItem.occurrence}
                        <button class="qun" onclick="updateBundleQuantity(${
                          bundleItem.id
                        }, 1)">+</button>
                    </p>
                    <p>Subtotal: $${bundleTotalPrice.toFixed(2)}</p>
                    <div>
                    <button id="remove" onclick="removeBundleItem(${
                      bundleItem.id
                    })">Remove</button>
                    </div>
                </div>
            `;
      }
    });
  
    // Add clear all and checkout buttons
    cartContainer.innerHTML += `
        <div id="cart-summary">
            <h3>Total Quantity: <span id="total-quantity">${totalQuantity}</span></h3>
            <h3>Total Price: $<span id="total-price">${totalPrice.toFixed(
              2
            )}</span></h3>
            <button type="button" class="clear-all"onclick="clearCart()">Clear Cart</button>
            <button type="button" class="checkout"onclick="checkout()">Checkout</button>
        </div>
    `;
    // Update total quantity and price
    document.getElementById("total-quantity").innerText = totalQuantity;
    document.getElementById("total-price").innerText = totalPrice.toFixed(2);
  }
  
  function updateQuantity(nb, productType, change) {
    console.log(
      `Updating quantity for product ID:${nb}, Type: ${productType}, Change: ${change}`
    );
    const cartItem = cartArray.find(
      (item) =>
        item.nb == nb && item.type.toLowerCase() == productType.toLowerCase()
    );
  
    if (cartItem) {
      console.log("Product found in cart:", cartItem);
      cartItem.occurrence += change;
      if (cartItem.occurrence <= 0) {
        cartArray.splice(cartArray.indexOf(cartItem), 1); // Remove the item if quantity is zero or less
      }
      localStorage.setItem("productsArr", JSON.stringify(cartArray)); // Update local storage
      displayCartItems(window.bundlesData, window.productsData); // Refresh the cart display
    } else {
      console.warn("Product not found in cart:", { nb, productType });
    }
  }
  
  function updateBundleQuantity(bundleId, change) {
    const bundleItem = bundlesArray.find((item) => item.id === bundleId);
    if (bundleItem) {
      bundleItem.occurrence += change;
      if (bundleItem.occurrence <= 0) {
        bundlesArray.splice(bundlesArray.indexOf(bundleItem), 1); // Remove the item if quantity is zero or less
      }
      localStorage.setItem("bundlesArr", JSON.stringify(bundlesArray)); // Update local storage
  
      // Refresh the cart display using the globally stored data
      displayCartItems(window.bundlesData, window.productsData);
    }
  }
  // Remove a single item from the cart (products)
  function removeItem(nb, productType) {
    const cartItemIndex = cartArray.findIndex(
      (item) =>
        item.nb == nb && item.type.toLowerCase() == productType.toLowerCase()
    );
    if (cartItemIndex !== -1) {
      cartArray.splice(cartItemIndex, 1); // Remove the item
      localStorage.setItem("productsArr", JSON.stringify(cartArray)); // Update local storage
      displayCartItems(window.bundlesData, window.productsData); // Refresh the cart display
    }
  }
  
  // Remove a single bundle item from the cart
  function removeBundleItem(bundleId) {
    const bundleItemIndex = bundlesArray.findIndex(
      (item) => item.id === bundleId
    );
    if (bundleItemIndex !== -1) {
      bundlesArray.splice(bundleItemIndex, 1); // Remove the item
      localStorage.setItem("bundlesArr", JSON.stringify(bundlesArray)); // Update local storage
      displayCartItems(window.bundlesData, window.productsData); // Refresh the cart display
    }
  }
  
  // Clear all items from the cart
  function clearCart() {
    cartArray.length = 0; // Empty the cart array
    bundlesArray.length = 0; // Empty the bundles array
    localStorage.removeItem("productsArr"); // Remove from local storage
    localStorage.removeItem("bundlesArr"); // Remove from local storage
    displayCartItems(window.bundlesData, window.productsData); // Refresh the cart display
  }
  
  // Checkout function (aamalo li badkon ye fiya)
  let checkoutTab = null;
  
  function checkout() {
    const productsArr = JSON.parse(localStorage.getItem("productsArr")) || [];
    const bundlesArr = JSON.parse(localStorage.getItem("bundlesArr")) || [];
  
    if (productsArr.length === 0 && bundlesArr.length === 0) {
      alert("Your cart is empty. Add items to your cart before checking out.");
      return;
    }
  
    // Fetch products.json
    fetch("data/products.json")
      .then((response) => response.json())
      .then((data) => {
        const products = data.games;
        const checkoutItems = [];
        let subtotal = 0;
        let discount = 0;
        const delivery = 5.99;
        let totalQuantity = 0;
  
        productsArr.forEach((cartItem) => {
          const product = products.find((item) => item.id == cartItem.nb);
          if (!product) {
            console.error(`Product with id ${cartItem.nb} not found.`);
            return;
          }
  
          const platform = product.platforms.find(
            (p) => p.type === cartItem.type
          );
          if (!platform) {
            console.error(
              `Platform ${cartItem.type} not found for product id ${product.id}.`
            );
            return;
          }
  
          const price = platform.price;
          const discountedPrice = cartItem.discountedPrice || price;
          const totalItemPrice = discountedPrice * cartItem.occurrence;
  
          subtotal += price * cartItem.occurrence;
          discount += (price - discountedPrice) * cartItem.occurrence;
          totalQuantity += cartItem.occurrence;
  
          checkoutItems.push({
            id: product.id,
            name: product.name,
            platform: platform.type,
            quantity: cartItem.occurrence,
            price: discountedPrice,
            totalItemPrice: totalItemPrice,
            image: platform.image,
          });
        });
  
        const finalTotal = subtotal - discount + delivery;
  
        localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
        localStorage.setItem("finalTotal", finalTotal.toFixed(2));
        localStorage.setItem("totalQuantity", totalQuantity.toString());
      })
      .catch((error) => {
        console.error("Error loading cart data:", error);
      });
  
    // Fetch bundles.json
    fetch("data/bundles.json")
      .then((response) => response.json())
      .then((data) => {
        const products = data.bundles;
        const bundleCheckoutItems = [];
        let bundlesSubtotal = 0;
        let discount = 0;
        let bundlesTotalQuantity = 0;
  
        bundlesArr.forEach((cartItem) => {
          const product = products.find((item) => item.id == cartItem.id);
          if (!product) {
            console.error(`Product with id ${cartItem.id} not found.`);
            return;
          }
  
          const price = product.price;
          const discountedPrice = cartItem.discountedPrice || price;
          const bundlesTotalItemPrice = discountedPrice * cartItem.occurrence;
  
          bundlesSubtotal += price * cartItem.occurrence;
          discount += (price - discountedPrice) * cartItem.occurrence;
          bundlesTotalQuantity += cartItem.occurrence;
  
          bundleCheckoutItems.push({
            id: product.id,
            name: product.name,
            platform: product.type,
            quantity: cartItem.occurrence,
            price: discountedPrice,
            bundlesTotalItemPrice: bundlesTotalItemPrice,
            image: product.image,
          });
        });
  
        const bundlesFinalTotal = bundlesSubtotal - discount;
  
        // Ensure no overwrite or issues in local storage set operation
        console.log("Setting bundle checkout items:", bundleCheckoutItems);
        localStorage.setItem(
          "bundleCheckoutItems",
          JSON.stringify(bundleCheckoutItems)
        );
        localStorage.setItem("bundlesFinalTotal", bundlesFinalTotal.toFixed(2));
        localStorage.setItem(
          "bundlesTotalQuantity",
          bundlesTotalQuantity.toString()
        );
  
        // Open or focus on the checkout tab
        if (checkoutTab === null || checkoutTab.closed) {
          checkoutTab = window.location.replace("checkout.html");
          setTimeout(() => {
            checkoutTab.postMessage({ type: "updateCheckout" }, "*");
          }, 500);
        } else {
          checkoutTab.focus();
          checkoutTab.postMessage({ type: "updateCheckout" }, "*");
        }
      })
      .catch((error) => {
        console.error("Error loading bundles data:", error);
      });
  }