let games = {
  games: [],
};


let productID = new URLSearchParams(window.location.search).get('id');
window.addEventListener("storage", function (event) {
  if (event.key === "productsArr" || event.key==="bundlesArr") {
      updateCartCount();
  }
});


document.addEventListener("DOMContentLoaded",async ()=>{
   // Generate two distinct random numbers between 1 and 4
   let rand_number = Math.floor(Math.random() * 4) + 1;
   let rand_number2 = Math.floor(Math.random() * 4) + 1;
 
   // Ensure the numbers are not equal
   while(rand_number === rand_number2) {
     rand_number2 = Math.floor(Math.random() * 4) + 1;
   }
  let originalContent;  
  try{
  const response = await fetch("data/products.json");
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
}
  const data = await response.json();
  const products = data.games;

  originalContent = document.getElementById("big-container").innerHTML;

  const searchBar = document.getElementById("search-bar");
  searchBar.addEventListener("input",async function(event) {
      const query = event.target.value.trim().toLowerCase();
      if (query === "") {
          restoreOriginalContent(originalContent);
          loadGames(productID,products);
          loadBundles(rand_number,rand_number2);
          
        
      } else {
          searchProducts(products, query);
      }
  });
  
 await loadBundles(rand_number,rand_number2);
await loadGames(productID,products);
updateCartCount();
document.getElementById("bundle1-button").addEventListener("click",()=>addBundlesToCart(rand_number));
    document.getElementById("bundle2-button").addEventListener("click",()=>addBundlesToCart(rand_number2));
    var dropdown = document.getElementById('categoryList');
    dropdown.style.display = 'none'; 

    document.getElementById('categoriesLink').addEventListener('click', function(event) {
      event.preventDefault(); 
      if (dropdown.style.display === 'block') {
          dropdown.style.display = 'none';
      } else {
          dropdown.style.display = 'block';
      }
  });
}catch(error){
  console.error('Error loading products:', error);
}

})







async function loadGames(productId,products) { 
  try {
   

    let product = products.find((item) => item.id == productId);

    if (product) {
      // for the background image
      const backgroundElement = document.querySelector(".background");
      const coverImagePath = product.cover;

      backgroundElement.style.backgroundImage = `
        linear-gradient(
        to top, rgba(0,0,0,1),
        rgba(0,0,0,0.7)20%,
        rgba(0,0,0,0.5) 40%,
        rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%),
        url('${coverImagePath}')
      `;

      // name of game
      document.getElementById("product-name").textContent = product.name;

      // description of the game
      document.getElementById("product-description").innerHTML =
        product.description;

      // price ps5 by default
      document.getElementById(
        "product-price"
      ).textContent = `$${product.platforms[0].price}`;

      // buttons changes
      const buttons = document.querySelectorAll(".buttons button");
      buttons.forEach((button) => {
        button.addEventListener("click", function () {
          const platformType = this.getAttribute("data-platform");
          const consoleType = platformType;
          localStorage.setItem("console", consoleType);

          const platform = product.platforms.find(
            (p) => p.type === platformType
          );

          if (platform) {
            document.getElementById(
              "product-price"
            ).textContent = `$${platform.price}`;

            const typeElement = this;
            const allbuttons = document.querySelectorAll(".buttons button");

            allbuttons.forEach((btn) => {
              btn.classList.remove("white", "blue", "DarkGreen", "LightGreen");
              btn.classList.add("default-style");
            });

            switch (platformType) {
              case "ps5":
                typeElement.classList.add("white");
                typeElement.classList.remove("default-style");
                break;
              case "ps4":
                typeElement.classList.add("blue");
                typeElement.classList.remove("default-style");
                break;
              case "xbox one":
                typeElement.classList.add("DarkGreen");
                typeElement.classList.remove("default-style");
                break;
              case "xbox x":
                typeElement.classList.add("LightGreen");
                typeElement.classList.remove("default-style");
                break;
              default:
                typeElement.classList.add("white");
                break;
            }
          }
        });
      });

      // some details
      document.getElementById(
        "category"
      ).textContent = `Category : ${product.category}`;
      document.getElementById(
        "release-date"
      ).textContent = `Release Date : ${product.releaseDate}`;
      document.getElementById(
        "developer"
      ).textContent = `Developer : ${product.developer}`;
      document.getElementById(
        "publisher"
      ).textContent = `Publisher : ${product.publisher}`;
      document.getElementById(
        "tags"
      ).textContent = `Rating : ${product.rating}`;
      document.getElementById("tags").textContent = `Tags : ${product.tags}`;
      document.getElementById(
        "rating"
      ).textContent = `Rating : ${product.rating}`;

      // reviews of users
      const reviewsElement = document.getElementById("Reviews");
      product.reviews.forEach((review) => {
        reviewsElement.innerHTML += `<section> <h2> ${review.username}</h2> <h3> ${review.rating}</h3> <br> <p> ${review.comment} </p> </section> <br>`;
      });

      // trailer section
      document.getElementsByClassName(
        "trailer"
      )[0].innerHTML = `<iframe width="1200" height="600" src="${product.trailerUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      
      // add to cart
      let cartBtn = document.getElementById("cart-button");
      cartBtn.addEventListener("click", () => {
        let productsArr = JSON.parse(localStorage.getItem("productsArr")) || [];

        const typeOfConsole = localStorage.getItem("console");
        const nb = productID;
        const existingProductIndex = productsArr.findIndex(
          (product) => product.nb === nb && product.type === typeOfConsole
        );

        if (existingProductIndex !== -1) {
          productsArr[existingProductIndex].occurrence++;
        } else {
          productsArr.push({ nb: nb, type: typeOfConsole, occurrence: 1 });
        }

        localStorage.setItem("productsArr", JSON.stringify(productsArr));
        updateCartCount();
      });
    } else {
      console.error("Product not found!");
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}






async function loadBundles(rand_number,rand_number2) {
  try {
    const response = await fetch('data/bundles.json');
    const data = await response.json();
    const bundles_arr = data.bundles;

    

    const bundles_div = document.getElementById("bundles");
    const bundle_1 = bundles_arr.find(bun => bun.id === rand_number);
    const bundle_2 = bundles_arr.find(bun => bun.id === rand_number2);

    const div_bundle1 = document.createElement('div');
    div_bundle1.classList.add("bundel-content");
    div_bundle1.innerHTML = `<div><img src="${bundle_1.image}" alt=""></div>
        <div>
          <h1 class="bundel_name">${bundle_1.name}</h1>
          <h3 class="bundle_price">${bundle_1.price}$</h3>
          <h3 class="bundle_type"> type: ${bundle_1.type}</h3>
          <p class="bundle_description"><br>${bundle_1.description}</p>
          <button class="bundel-button" id="bundle1-button">Add to cart</button>
        </div>`
    ;
    const div_bundle2 = document.createElement('div');
    div_bundle2.classList.add("bundel-content");
    div_bundle2.innerHTML = `<div><img src="${bundle_2.image}" alt=""></div>
        <div>
          <h1 class="bundel_name">${bundle_2.name}</h1>
          <h3 class="bundle_price">${bundle_2.price}$</h3>
          <h3 class="bundle_type"> type: ${bundle_2.type}</h3>
          <p class="bundle_description"><br>${bundle_2.description}</p>
          <button class="bundel-button" id="bundle2-button">Add to cart</button>
        </div>`
    ;
    
    bundles_div.appendChild(div_bundle1);
    bundles_div.appendChild(div_bundle2);
    
   
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}





function addBundlesToCart(id){
  const addedBundles=JSON.parse(localStorage.getItem('bundlesArr')) || [];
  const existingBundleIndex = addedBundles.findIndex(
    (bundle) =>  bundle.id===id
  );
  if (existingBundleIndex !== -1) {
    addedBundles[existingBundleIndex].occurrence++;
  } else {
    addedBundles.push({ id: id, occurrence: 1 });
  }

  localStorage.setItem("bundlesArr", JSON.stringify(addedBundles));

 
updateCartCount();

}



function updateCartCount() {
  // Retrieve the arrays from local storage
  const products = JSON.parse(localStorage.getItem('productsArr')) || [];
  const bundles = JSON.parse(localStorage.getItem('bundlesArr')) || [];

  // Calculate the total count of items
  const totalCount = products.length + bundles.length;

  // Update the counter on the page
  document.getElementById('cart-count').textContent = totalCount;
}







function searchProducts(products, query) {
    
  const results = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
  );

  displaySearchResults(results);
}

function displaySearchResults(products) {
  
  const mainContent = document.getElementById("big-container");

  
  mainContent.innerHTML = "";

  if (products.length === 0) {
      
      mainContent.innerHTML = "<p>No products found</p>";
      return;
  }

  let grid = document.createElement("div");
  grid.classList.add("games-grid");

  products.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("game-card1");
      productCard.addEventListener("click",()=>window.location.href="itemdetails.html?id="+product.id);
      productCard.innerHTML = `
          <img src="${product.bg}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.platforms[0].type}</p>
          <p>$${product.platforms[0].price}</p>
      `;
      grid.appendChild(productCard);
  });

  mainContent.appendChild(grid);
}

function restoreOriginalContent(originalContent) {
  const mainContent = document.getElementById("big-container");
  mainContent.innerHTML = originalContent;
}