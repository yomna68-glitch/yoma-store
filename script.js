

const API_URL = "https://dummyjson.com/products/category/skin-care";

const productsGrid = document.getElementById("productsGrid");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const categoryFilter = document.getElementById("categoryFilter");
const retryBtn = document.getElementById("retryBtn");

const cartCount = document.getElementById("cartCount");


let products = [];
let cart = [];



async function fetchProducts() {

    showLoading();

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        products = data.products;

        displayProducts(products);

        hideLoading();

    } catch (error) {

        console.error("Error:", error);

        hideLoading();
        showError();
    }
}



function displayProducts(productsToDisplay) {

    productsGrid.innerHTML = "";

    if (productsToDisplay.length === 0) {

        productsGrid.innerHTML = `
            <div class="status-message">
                <p>مفيش منتجات مطابقة للبحث 🥺</p>
            </div>
        `;

        return;
    }

    productsToDisplay.forEach(product => {

        const productCard = document.createElement("article");

        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img 
                src="${product.thumbnail}" 
                alt="${product.title}"
            >

            <div class="product-info">

                <h3>${product.title}</h3>

                <p>${product.description}</p>

                <div class="price">
                    $${product.price}
                </div>

                <button 
                    class="add-to-cart"
                    data-id="${product.id}"
                >
                    <i class="fa-solid fa-cart-plus"></i>
                    أضف للسلة
                </button>

            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    addCartEvents();
}



function searchProducts() {

    const searchValue = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchValue) ||
        product.description.toLowerCase().includes(searchValue)
    );

    displayProducts(filteredProducts);
}


searchBtn.addEventListener("click", searchProducts);



searchInput.addEventListener("input", searchProducts);



searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchProducts();
    }

});



categoryFilter.innerHTML = `
    <option value="all">كل منتجات العناية</option>
    <option value="beauty">Beauty</option>
    <option value="fragrances">Fragrances</option>
    <option value="skin-care">Skin Care</option>
`;

categoryFilter.addEventListener("change", function() {

    const selectedCategory = categoryFilter.value;

    if (selectedCategory === "all") {

        displayProducts(products);

        return;
    }

    const filteredProducts = products.filter(product =>
        product.category === selectedCategory
    );

    displayProducts(filteredProducts);
});



function addCartEvents() {

    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(button => {

        button.addEventListener("click", function() {

            const productId = Number(button.dataset.id);

            const selectedProduct = products.find(
                product => product.id === productId
            );

            if (selectedProduct) {

                cart.push(selectedProduct);

                updateCartCount();

                button.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    تمت الإضافة
                `;

                button.disabled = true;

                setTimeout(() => {

                    button.innerHTML = `
                        <i class="fa-solid fa-cart-plus"></i>
                        أضف للسلة
                    `;

                    button.disabled = false;

                }, 1200);
            }

        });

    });
}


// Update cart number
function updateCartCount() {

    cartCount.textContent = cart.length;

}



function showLoading() {

    loadingState.classList.remove("hidden");

    errorState.classList.add("hidden");

    productsGrid.innerHTML = "";
}


function hideLoading() {

    loadingState.classList.add("hidden");
}


function showError() {

    errorState.classList.remove("hidden");

    productsGrid.innerHTML = "";
}



retryBtn.addEventListener("click", function() {

    fetchProducts();

});



fetchProducts();