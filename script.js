/* =========================================================
   PRESENT PERFECT STORE
   GitHub Images -> Products
========================================================= */


/* ---------------------------------------------------------
   GITHUB IMAGE FOLDER
--------------------------------------------------------- */

const GITHUB_IMAGES_API =
    "https://api.github.com/repos/AnimeshShrivastav/animeshrivastav.github.io/contents/images";


const IMAGE_FOLDER =
    "images";


/* ---------------------------------------------------------
   STATE
--------------------------------------------------------- */

let products = [];

let cart =
    JSON.parse(
        localStorage.getItem(
            "presentPerfectCart"
        ) || "[]"
    );

let selectedCategory =
    "All";


/* ---------------------------------------------------------
   DOM
--------------------------------------------------------- */

const productGrid =
    document.getElementById(
        "productGrid"
    );


const productCount =
    document.getElementById(
        "productCount"
    );


const message =
    document.getElementById(
        "message"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const categories =
    document.getElementById(
        "categories"
    );


const cartCount =
    document.getElementById(
        "cartCount"
    );


/* ---------------------------------------------------------
   PARSE FILENAME
--------------------------------------------------------- */

/*

Example:

AJ001_Necklace_MRP799.jpg

becomes:

code     = AJ001
category = Necklace
price    = 799

Another:

GD001_Home_Decor_MRP1299.jpg

becomes:

code     = GD001
category = Home Decor
price    = 1299

*/

function parseFilename(filename) {

    const withoutExtension =
        filename.replace(
            /\.[^/.]+$/,
            ""
        );


    const parts =
        withoutExtension.split(
            "_"
        );


    const code =
        parts.shift() ||
        withoutExtension;


    const priceMatch =
        withoutExtension.match(
            /(?:MRP|PRICE)[-_]?(\d+(?:\.\d+)?)/i
        );


    const price =
        priceMatch
            ? Number(
                priceMatch[1]
            )
            : 0;


    const categoryParts =
        parts.filter(
            part =>
                !/^(MRP|PRICE)[-_]?\d+/i.test(
                    part
                )
        );


    const category =
        categoryParts
            .join(" ")
            .replace(
                /-/g,
                " "
            )
            .trim() ||
        "Product";


    return {

        code:
            code,

        name:
            category,

        category:
            category,

        price:
            price,

        filename:
            filename,

        image:
            IMAGE_FOLDER +
            "/" +
            encodeURIComponent(
                filename
            )
    };
}


/* ---------------------------------------------------------
   LOAD IMAGES FROM GITHUB
--------------------------------------------------------- */

async function loadProducts() {

    message.textContent =
        "Loading products...";


    try {

        const response =
            await fetch(
                GITHUB_IMAGES_API +
                "?t=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "GitHub API returned HTTP " +
                response.status
            );
        }


        const files =
            await response.json();


        if (!Array.isArray(files)) {

            throw new Error(
                "GitHub response is not an array."
            );
        }


        products =
            files
                .filter(
                    file =>
                        file.type === "file" &&
                        /\.(jpg|jpeg|png|webp|gif)$/i.test(
                            file.name
                        )
                )
                .map(
                    file =>
                        parseFilename(
                            file.name
                        )
                );


        createCategories();

        renderProducts();

        updateCartCount();


    }
    catch (error) {

        console.error(
            "PRODUCT LOADING ERROR:",
            error
        );


        productGrid.innerHTML =
            "";


        productCount.textContent =
            "Error";


        message.textContent =
            "Could not read the GitHub images folder.";
    }
}


/* ---------------------------------------------------------
   CATEGORIES
--------------------------------------------------------- */

function createCategories() {

    const categorySet =
        new Set();


    products.forEach(
        product => {

            categorySet.add(
                product.category
            );

        }
    );


    const categoryArray =
        [
            "All",
            ...Array.from(
                categorySet
            ).sort()
        ];


    categories.innerHTML =
        "";


    categoryArray.forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "category-button";


            button.textContent =
                category;


            if (
                category ===
                selectedCategory
            ) {

                button.classList.add(
                    "active"
                );
            }


            button.onclick =
                function () {

                    selectedCategory =
                        category;

                    createCategories();

                    renderProducts();
                };


            categories.appendChild(
                button
            );

        }
    );
}


/* ---------------------------------------------------------
   FILTER
--------------------------------------------------------- */

function getFilteredProducts() {

    const search =
        searchInput
            .value
            .trim()
            .toLowerCase();


    return products.filter(
        product => {

            const categoryMatch =
                selectedCategory ===
                "All" ||
                product.category ===
                selectedCategory;


            const searchText =
                (
                    product.code +
                    " " +
                    product.name +
                    " " +
                    product.category
                )
                    .toLowerCase();


            const searchMatch =
                !search ||
                searchText.includes(
                    search
                );


            return (
                categoryMatch &&
                searchMatch
            );
        }
    );
}


/* ---------------------------------------------------------
   RENDER
--------------------------------------------------------- */

function renderProducts() {

    const filtered =
        getFilteredProducts();


    productGrid.innerHTML =
        "";


    productCount.textContent =
        filtered.length +
        " product" +
        (
            filtered.length === 1
                ? ""
                : "s"
        );


    if (
        filtered.length === 0
    ) {

        message.textContent =
            "No products found.";

        return;
    }


    message.textContent =
        "";


    filtered.forEach(
        product => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            const price =
                product.price > 0
                    ? "₹" +
                      product.price.toLocaleString(
                          "en-IN"
                      )
                    : "Price on request";


            card.innerHTML = `

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

                <div class="product-info">

                    <div class="product-category">
                        ${escapeHTML(product.category)}
                    </div>

                    <div class="product-name">
                        ${escapeHTML(product.name)}
                    </div>

                    <div class="product-code">
                        ${escapeHTML(product.code)}
                    </div>

                    <div class="product-bottom">

                        <span class="product-price">
                            ${price}
                        </span>

                        <button
                            class="add-button"
                            type="button"
                        >
                            Add
                        </button>

                    </div>

                </div>
            `;


            card
                .querySelector(
                    ".add-button"
                )
                .onclick =
                function () {

                    addToCart(
                        product.code
                    );
                };


            productGrid.appendChild(
                card
            );

        }
    );
}


/* ---------------------------------------------------------
   CART
--------------------------------------------------------- */

function addToCart(code) {

    const existing =
        cart.find(
            item =>
                item.code === code
        );


    if (existing) {

        existing.quantity++;

    }
    else {

        cart.push({

            code:
                code,

            quantity:
                1
        });
    }


    saveCart();

    updateCartCount();


    alert(
        "Product added to cart."
    );
}


function saveCart() {

    localStorage.setItem(
        "presentPerfectCart",
        JSON.stringify(
            cart
        )
    );
}


function updateCartCount() {

    const total =
        cart.reduce(
            (
                sum,
                item
            ) =>
                sum +
                item.quantity,
            0
        );


    cartCount.textContent =
        total;
}


/* ---------------------------------------------------------
   ESCAPE HTML
--------------------------------------------------------- */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* ---------------------------------------------------------
   SEARCH
--------------------------------------------------------- */

searchInput.addEventListener(
    "input",
    renderProducts
);


/* ---------------------------------------------------------
   YEAR
--------------------------------------------------------- */

document.getElementById(
    "year"
).textContent =
    new Date().getFullYear();


/* ---------------------------------------------------------
   START
--------------------------------------------------------- */

updateCartCount();

loadProducts();
