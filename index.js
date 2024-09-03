const menuBtn = document.getElementById("menu-btn");
const slideUpMenu = document.getElementById("slide-up-menu");
const closeBtn = document.getElementById("close-btn");
const filterBtn=document.getElementById("filter-btn");
const filterSlideUp=document.getElementById("filter-slide-up-menu");
const filterClosBtn=document.getElementById("filter-close-btn");
const mainContent=document.getElementById("main-content");
const productsContainer=document.getElementById("products");

document.addEventListener("DOMContentLoaded",async function() {
    const banner = document.getElementById('banner');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            banner.classList.add('scrolled');
        } else {
            banner.classList.remove('scrolled');
        }
    });
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';  // Convert to boolean
    if(localStorage.getItem('isLoggedIn') == null){
        localStorage.setItem('isLoggedIn', 'false');
        isLoggedIn = false;
    }
    
    document.getElementById("recommended-games").addEventListener("click", function (event) {
        var gameDiv = event.target.closest(".game-card");
        if (gameDiv) {
            var gameId = gameDiv.getAttribute("data-id");
            window.location.href = "itemdetails.html?id=" + gameId;
        }
    })
let changePass=document.getElementById("changePass");
changePass.addEventListener("click",()=>{
    if(isLoggedIn==false){
        let loggInModal= document.getElementById("notLoggedIn-modal");
        loggInModal.style.display="block";
         document.getElementById("close-btn-logg").addEventListener("click",()=>loggInModal.style.display="none");
    }
    else{
        window.location.replace("changePass.html");
    }
})
    
const loggedINusername=localStorage.getItem('username');
    if(isLoggedIn==true){
document.getElementById("user-menu").innerHTML=
`<h2>Welcome ${loggedINusername}</h2>
  <a class="signup-link" id="logOut">Log out</a>
`;
document.getElementById("logOut").addEventListener("click",()=>{  
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('username');
    localStorage.removeItem('bundlesArr');
    localStorage.removeItem('productsArr');

    location.reload(true);
    
})
    }

    // Listen for the storage event to detect changes to localStorage
window.addEventListener("storage", function (event) {
    if (event.key === "productsArr" || event.key==="bundlesArr") {
        updateCartCount();
    }
  });
    updateCartCount();
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
    let originalContent;  

    try {
       
        const response = await fetch('data/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

     const data=   await response.json();
        const products = data.games;
        loadItems(products);

     
        originalContent = document.getElementById("big-container").innerHTML;

       
        const searchBar = document.getElementById("search-bar");
        searchBar.addEventListener("input",async function(event) {
            const query = event.target.value.trim().toLowerCase();
            if (query === "") {
                restoreOriginalContent(originalContent);
               await loadBundles();
            } else {
                searchProducts(products, query);
            }
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
   

    menuBtn.addEventListener("click", function() {
        slideUpMenu.classList.add("open");
        filterBtn.classList.add("hidden");
        menuBtn.classList.add("hidden");
    });

    closeBtn.addEventListener("click", function() {
        slideUpMenu.classList.remove("open");
        filterBtn.classList.remove("hidden");
        menuBtn.classList.remove("hidden");

    });
    filterBtn.addEventListener("click", function() {
        filterSlideUp.classList.add("open");
        filterBtn.classList.add("hidden");
        menuBtn.classList.add("hidden");

    });

    filterClosBtn.addEventListener("click", function() {
        filterSlideUp.classList.remove("open");
        filterBtn.classList.remove("hidden");
        menuBtn.classList.remove("hidden");
    });
    const rangeInput = document.getElementById("maxPrice"); 
    const priceDisplay = document.getElementById("priceDisplay"); 
 
    priceDisplay.textContent = rangeInput.value;

    
    rangeInput.addEventListener("input", function() {
        priceDisplay.textContent = this.value;
    });
    const menuFilter=document.getElementById("menu&filter");
    const footer = document.getElementById("footer");
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          menuFilter.classList.add("hidden")
         
        } else  {
            menuFilter.classList.remove("hidden");
            
        }
      });
    });
  
    observer.observe(footer);

async function  loadBundles() {
    try {
        const response = await fetch('data/bundles.json');
       const data = await response.json();
       const bundles= data.bundles;
    
        const bundlesContainer = document.getElementById('bundles-container');
        
        // Generate HTML for each bundle
        bundles.forEach(bundle => {
          const bundleCard = document.createElement('div');
          bundleCard.classList.add('bundle-card');
          
          bundleCard.innerHTML = `
            <img src="${bundle.image}" alt="${bundle.name}">
            <h3>${bundle.name}</h3>
            <p>${bundle.description}</p>
            <p>Type: ${bundle.type}</p>
            <p>Price: $${bundle.price.toFixed(2)}</p>
           <button class="add-to-cart-btn" data-bundle-id="${bundle.id}">Add to Cart</button>
          `;
    
          bundlesContainer.appendChild(bundleCard);
        });
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                
              const bundleId = parseInt(event.target.getAttribute('data-bundle-id'));
              console.log(isLoggedIn);
              addBundleToCart(bundleId,isLoggedIn);
                
            });
        });
    
        initializeSlider();
    
      } catch (error) {
        console.error('Error loading bundles:', error);
      }
    }
   await loadBundles();
  });
  

    

   
   
   
   
function loadItems(products){


    const renderGames = (category, containerId,platformINdex) => {
        const container = document.getElementById(containerId);
        let char="-";
        let index=containerId.indexOf(char);
        let categName;
        if(index !==-1){
             categName=containerId.slice(0,index);
        }
       let grid=document.createElement("div");
       grid.classList.add("games-grid");

        container.innerHTML = 
        `<h1>${categName}</h1>
        `; 
        
        category.forEach(game => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card1");
            gameCard.style.att
            gameCard.setAttribute('data-id',game.id);
            gameCard.addEventListener("click",()=>{window.location.href='itemdetails.html?id='+game.id})
            gameCard.innerHTML = `
                <img src="${game.bg}"">
                <h3>${game.name}</h3>
                <p>${game.platforms[platformINdex].type}</p>
                <p>$${game.platforms[platformINdex].price}</p>
                
            
            `;

            grid.appendChild(gameCard);
        });
        container.appendChild(grid);
    };

    filter();
    
    let confirmFilterBtn= document.getElementById("filter-confirm-btn");
    confirmFilterBtn.addEventListener("click", () =>{
     filterSlideUp.classList.remove("open");
     filterBtn.classList.remove("hidden");
     menuBtn.classList.remove("hidden");
     filter();
    })
   
  
function filter() {
        const radios=document.getElementsByName('platform');
        let selectedPlatform;
        for (let i =0;i< radios.length;i++){
            if(radios[i].checked){
                selectedPlatform=i;
                break;
            }
        }
        let maxPriceValue=document.getElementById("maxPrice").value;

        const filters = {
            Action: document.getElementById("action").checked,
            Sports: document.getElementById("sports").checked,
            Survival: document.getElementById("survival").checked,
            Adventure: document.getElementById("adventure").checked,
        };


         

    
        let filteredGames = products.filter(game => game.platforms[selectedPlatform].price <= maxPriceValue);
 
 const activeCategories = Object.keys(filters).filter(category => filters[category]);

 if (activeCategories.length > 0) {
     filteredGames = filteredGames.filter(game => activeCategories.includes(game.category));
 }

 
 document.getElementById("action-category").innerHTML = "";
 document.getElementById("sports-category").innerHTML = "";
 document.getElementById("survival-category").innerHTML = "";
 document.getElementById("adventure-category").innerHTML = "";

 
 activeCategories.forEach(category => {
    renderGames(filteredGames.filter(game => game.category === category), `${category.toLowerCase()}-category`, selectedPlatform);
});


if (activeCategories.length === 0) {
    renderGames(filteredGames.filter(game => game.category === "Action"), "action-category", selectedPlatform);
    renderGames(filteredGames.filter(game => game.category === "SPORTS"), "sports-category", selectedPlatform);
    renderGames(filteredGames.filter(game => game.category === "Survival"), "survival-category", selectedPlatform);
    renderGames(filteredGames.filter(game => game.category === "Adventure"), "adventure-category", selectedPlatform);
}
}
    

    
};

function searchProducts(products, query) {
    
    const results = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );

    displaySearchResults(results);
}

function displaySearchResults(products) {
    filterBtn.classList.add("hidden");
    slideUpMenu.classList.remove("open");
    filterSlideUp.classList.remove("open");
    menuBtn.classList.add("hidden");
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
    document.getElementById("maxPrice").value=100;
    document.getElementById("priceDisplay").innerText=100;
    mainContent.innerHTML = originalContent;
    filterBtn.classList.remove("hidden");
    menuBtn.classList.remove ("hidden");
    document.getElementById("ps5").checked=true;
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="categ"]');
checkboxes.forEach(chk => {
    chk.checked = false; 
});
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
// !!!!!!!!!!! ma tensa taayetla,call updateCartCount() whenever you know items are added or removed






function initializeSlider() {
    const slider = document.querySelector('.bundles-container');
    let isDown = false;
    let startX;
    let scrollLeft;
  
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
  
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
  
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
  
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // The *2 value adjusts the scroll speed
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  function addBundleToCart(bundleId,cond) {
    const addedBundles = JSON.parse(localStorage.getItem('bundlesArr')) || [];
  
    const existingBundleIndex = addedBundles.findIndex(
      (bundle) => bundle.id === bundleId
    );
console.log(cond);
    if(cond==false){
        let loggInModal= document.getElementById("notLoggedIn-modal");
       loggInModal.style.display="block";
        document.getElementById("close-btn-logg").addEventListener("click",()=>loggInModal.style.display="none");
    }
    else{
    if (existingBundleIndex !== -1) {
      addedBundles[existingBundleIndex].occurrence++;
    } else {
      addedBundles.push({ id: bundleId, occurrence: 1 });
    }
  
    localStorage.setItem("bundlesArr", JSON.stringify(addedBundles));
    showModal();
    updateCartCount();
}
  }

  function showModal() {
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.modal .close-btn-cart');
  
    modal.style.display = 'block';
  
    // Close the modal when the user clicks on the close button
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  
    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
  
    
  }

  function scrollToProducts() {
    const productsSection = document.getElementById('products');
    productsSection.scrollIntoView({ behavior: 'smooth' });
}