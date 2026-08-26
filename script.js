```javascript
/* ============================================================
   PRESENT PERFECT STORE
   Static GitHub Pages Store
   No Flask
   No Python
   No Database
============================================================ */


/* ============================================================
   CONFIGURATION
============================================================ */

/*
   IMPORTANT:
   Replace this with the WhatsApp number that should
   receive customer orders.

   Include country code.

   India example:
   919876543210

   Do NOT use +, spaces or hyphens.
*/

const WHATSAPP_NUMBER =
    "919XXXXXXXXX";


/*
   Product JSON file
*/

const PRODUCTS_URL =
    "products.json";


/*
   Product image folder
*/

const IMAGE_FOLDER =
    "images/thumbnails";


/*
   Currency
*/

const CURRENCY =
    "₹";


/* ============================================================
   STATE
============================================================ */

let products = [];

let cart = [];

let activeCategory = "All";

let searchText = "";


/* ============================================================
   DOM
============================================================ */

const productGrid =
    document.getElementById(
        "productGrid"
    );

const productCount =
    document.getElementById(
        "productCount"
    );

const emptyMessage =
    document.getElementById(
        "emptyMessage"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const categoryList =
    document.getElementById(
        "categoryList"
    );

const cartButton =
    document.getElementById(
        "cartButton"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const cartDrawer =
    document.getElementById(
        "cartDrawer"
    );

const cartOverlay =
    document.getElementById(
        "cartOverlay"
    );

const closeCart =
    document.getElementById(
        "closeCart"
    );

const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );

const checkoutButton =
    document.getElementById(
        "checkoutButton"
    );

const clearCartButton =
    document.getElementById(
        "clearCart"
    );

const checkoutModal =
    document.getElementById(
        "checkoutModal"
    );

const closeCheckout =
    document.getElementById(
        "closeCheckout"
    );

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );

const checkoutSummary =
    document.getElementById(
        "checkoutSummary"
    );


/* ============================================================
   LOAD CART
============================================================ */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                "presentPerfectCart"
            );

        if (saved) {

            cart =
                JSON.parse(saved);

        }

    } catch (error) {

        console.error(
            "Could not load cart:",
            error
        );

        cart = [];
    }
}


/* ============================================================
   SAVE CART
============================================================ */

function saveCart() {

    localStorage.setItem(
        "presentPerfectCart",
        JSON.stringify(cart)
    );
}


/* ============================================================
   LOAD PRODUCTS
============================================================ */

async function loadProducts() {

    try {

        productCount.textContent =
            "Loading products...";


        const response =
            await fetch(
                PRODUCTS_URL,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        products =
            await response.json();


        if (!Array.isArray(products)) {

            throw new Error(
                "products.json must contain an array."
            );
        }


        createCategories();

        renderProducts();

        updateCart();


    } catch (error) {

        console.error(error);

        productGrid.innerHTML = "";

        productCount.textContent =
            "Could not load products.";

        emptyMessage.hidden = false;

        emptyMessage.innerHTML = `
            <div>⚠</div>
            <h3>Products could not be loaded</h3>
            <p>
                Please check that products.json
                exists in the same GitHub repository.
            </p>
        `;
    }
}


/* ============================================================
   IMAGE URL
============================================================ */

function getImageURL(product) {

    /*
       Main expected filename:
       PRODUCT_CODE.jpg

       Example:
       AJ001.jpg
    */

    const code =
        product.product_code ||
        product.code ||
        product.id;


    if (!code) {

        return "images/placeholder.jpg";
    }


    return (
        IMAGE_FOLDER +
        "/" +
        encodeURIComponent(code) +
        ".jpg"
    );
}


/* ============================================================
   CREATE CATEGORIES
============================================================ */

function createCategories() {

    const categorySet =
        new Set();


    products.forEach(
        product => {

            if (product.category) {

                categorySet.add(
                    product.category
                );
            }
        }
    );


    const categories =
        [
            "All",
            ...Array.from(
                categorySet
            ).sort()
        ];


    categoryList.innerHTML = "";


    categories.forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "category-button";


            if (
                category ===
                activeCategory
            ) {

                button.classList.add(
                    "active"
                );
            }


            button.textContent =
                category;


            button.addEventListener(
                "click",
                () => {

                    activeCategory =
                        category;


                    document
                        .querySelectorAll(
                            ".category-button"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    renderProducts();
                }
            );


            categoryList.appendChild(
                button
            );
        }
    );
}


/* ============================================================
   FILTER PRODUCTS
============================================================ */

function getFilteredProducts() {

    const search =
        searchText
            .trim()
            .toLowerCase();


    return products.filter(
        product => {

            const categoryMatch =
                activeCategory ===
                "All" ||
                String(
                    product.category || ""
                ).toLowerCase() ===
                activeCategory.toLowerCase();


            const searchableText =
                [
                    product.product_code,
                    product.name,
                    product.category,
                    product.tag,
                    product.description
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


            const searchMatch =
                !search ||
                searchableText.includes(
                    search
                );


            return (
                categoryMatch &&
                searchMatch
            );
        }
    );
}


/* ============================================================
   RENDER PRODUCTS
============================================================ */

function renderProducts() {

    const filtered =
        getFilteredProducts();


    productGrid.innerHTML = "";


    productCount.textContent =
        `${filtered.length} product` +
        (filtered.length === 1
            ? ""
            : "s");


    if (!filtered.length) {

        emptyMessage.hidden =
            false;

        return;

    } else {

        emptyMessage.hidden =
            true;
    }


    filtered.forEach(
        product => {

            productGrid.appendChild(
                createProductCard(
                    product
                )
            );
        }
    );
}


/* ============================================================
   PRODUCT CARD
============================================================ */

function createProductCard(product) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "product-card";


    const image =
        getImageURL(product);


    const code =
        product.product_code ||
        product.code ||
        product.id ||
        "";


    const name =
        product.name ||
        "Product";


    const category =
        product.category ||
        "Product";


    const price =
        Number(
            product.price ||
            product.mrp ||
            0
        );


    const oldPrice =
        Number(
            product.old_price ||
            product.original_price ||
            0
        );


    const description =
        product.description ||
        product.tag ||
        "";


    card.innerHTML = `

        <div class="product-image">

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(name)}"
                loading="lazy"
                onerror="this.src='images/placeholder.jpg'"
            >

        </div>


        <div class="product-info">

            <p class="product-category">
                ${escapeHTML(category)}
            </p>

            <h3 class="product-name">
                ${escapeHTML(name)}
            </h3>

            ${
                description
                    ? `
                        <p class="product-description">
                            ${escapeHTML(description)}
                        </p>
                    `
                    : ""
            }


            <div class="product-bottom">

                <div class="product-price">

                    ${formatPrice(price)}

                    ${
                        oldPrice > price
                            ? `
                                <span class="old-price">
                                    ${formatPrice(oldPrice)}
                                </span>
                            `
                            : ""
                    }

                </div>


                <button
                    class="add-button"
                    type="button"
                >
                    Add
                </button>

            </div>

        </div>
    `;


    const addButton =
        card.querySelector(
            ".add-button"
        );


    addButton.addEventListener(
        "click",
        () => {

            addToCart(
                code,
                1
            );
        }
    );


    return card;
}


/* ============================================================
   ADD TO CART
============================================================ */

function addToCart(
    productCode,
    quantity = 1
) {

    const product =
        products.find(
            item =>
                String(
                    item.product_code ||
                    item.code ||
                    item.id
                ) ===
                String(productCode)
        );


    if (!product) {
        return;
    }


    const existing =
        cart.find(
            item =>
                String(
                    item.productCode
                ) ===
                String(productCode)
        );


    if (existing) {

        existing.quantity +=
            quantity;

    } else {

        cart.push({

            productCode:
                productCode,

            quantity:
                quantity
        });
    }


    saveCart();

    updateCart();

    openCart();

    showTemporaryMessage(
        "Added to cart"
    );
}


/* ============================================================
   UPDATE CART
============================================================ */

function updateCart() {

    let totalQuantity = 0;

    let totalAmount = 0;


    cart.forEach(
        item => {

            const product =
                findProduct(
                    item.productCode
                );


            if (!product) {
                return;
            }


            const price =
                getProductPrice(
                    product
                );


            totalQuantity +=
                item.quantity;


            totalAmount +=
                price *
                item.quantity;
        }
    );


    cartCount.textContent =
        totalQuantity;


    cartTotal.textContent =
        formatPrice(
            totalAmount
        );


    renderCartItems();
}


/* ============================================================
   FIND PRODUCT
============================================================ */

function findProduct(code) {

    return products.find(
        product =>
            String(
                product.product_code ||
                product.code ||
                product.id
            ) ===
            String(code)
    );
}


/* ============================================================
   PRODUCT PRICE
============================================================ */

function getProductPrice(product) {

    return Number(
        product.price ||
        product.mrp ||
        0
    );
}


/* ============================================================
   RENDER CART
============================================================ */

function renderCartItems() {

    cartItems.innerHTML = "";


    const validItems =
        cart.filter(
            item =>
                findProduct(
                    item.productCode
                )
        );


    if (!validItems.length) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div style="font-size:3rem;">
                    🛒
                </div>

                <p>
                    Your cart is empty.
                </p>

            </div>
        `;

        return;
    }


    validItems.forEach(
        item => {

            const product =
                findProduct(
                    item.productCode
                );


            const price =
                getProductPrice(
                    product
                );


            const name =
                product.name ||
                "Product";


            const image =
                getImageURL(
                    product
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cart-item";


            row.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(name)}"
                    >

                </div>


                <div>

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <div class="cart-item-price">
                        ${formatPrice(price)}
                    </div>


                    <div class="quantity-controls">

                        <button
                            type="button"
                            data-action="minus"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            data-action="plus"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove-item"
                    type="button"
                    data-action="remove"
                >
                    Remove
                </button>
            `;


            row.querySelector(
                '[data-action="minus"]'
            ).addEventListener(
                "click",
                () =>
                    changeQuantity(
                        item.productCode,
                        -1
                    )
            );


            row.querySelector(
                '[data-action="plus"]'
            ).addEventListener(
                "click",
                () =>
                    changeQuantity(
                        item.productCode,
                        1
                    )
            );


            row.querySelector(
                '[data-action="remove"]'
            ).addEventListener(
                "click",
                () =>
                    removeFromCart(
                        item.productCode
                    )
            );


            cartItems.appendChild(
                row
            );
        }
    );
}


/* ============================================================
   CHANGE QUANTITY
============================================================ */

function changeQuantity(
    productCode,
    change
) {

    const item =
        cart.find(
            entry =>
                String(
                    entry.productCode
                ) ===
                String(productCode)
        );


    if (!item) {
        return;
    }


    item.quantity +=
        change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                entry =>
                    String(
                        entry.productCode
                    ) !==
                    String(productCode)
            );
    }


    saveCart();

    updateCart();
}


/* ============================================================
   REMOVE
============================================================ */

function removeFromCart(
    productCode
) {

    cart =
        cart.filter(
            item =>
                String(
                    item.productCode
                ) !==
                String(productCode)
        );


    saveCart();

    updateCart();
}


/* ============================================================
   CLEAR CART
============================================================ */

clearCartButton.addEventListener(
    "click",
    () => {

        if (!cart.length) {
            return;
        }


        cart = [];

        saveCart();

        updateCart();
    }
);


/* ============================================================
   OPEN CART
============================================================ */

function openCart() {

    cartDrawer.classList.add(
        "open"
    );

    cartOverlay.hidden =
        false;

    cartDrawer.setAttribute(
        "aria-hidden",
        "false"
    );
}


/* ============================================================
   CLOSE CART
============================================================ */

function closeCartDrawer() {

    cartDrawer.classList.remove(
        "open"
    );

    cartOverlay.hidden =
        true;

    cartDrawer.setAttribute(
        "aria-hidden",
        "true"
    );
}


cartButton.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartDrawer
);


cartOverlay.addEventListener(
    "click",
    closeCartDrawer
);


/* ============================================================
   CHECKOUT
============================================================ */

checkoutButton.addEventListener(
    "click",
    () => {

        if (!cart.length) {

            showTemporaryMessage(
                "Your cart is empty."
            );

            return;
        }


        renderCheckoutSummary();

        checkoutModal.hidden =
            false;
    }
);


/* ============================================================
   CLOSE CHECKOUT
============================================================ */

closeCheckout.addEventListener(
    "click",
    () => {

        checkoutModal.hidden =
            true;
    }
);


/* ============================================================
   CHECKOUT SUMMARY
============================================================ */

function renderCheckoutSummary() {

    let html = "";

    let total = 0;


    cart.forEach(
        item => {

            const product =
                findProduct(
                    item.productCode
                );


            if (!product) {
                return;
            }


            const price =
                getProductPrice(
                    product
                );


            const amount =
                price *
                item.quantity;


            total += amount;


            html += `

                <div class="summary-row">

                    <span>
                        ${escapeHTML(
                            product.name ||
                            item.productCode
                        )}
                        × ${item.quantity}
                    </span>

                    <strong>
                        ${formatPrice(amount)}
                    </strong>

                </div>
            `;
        }
    );


    html += `

        <div class="summary-row summary-total">

            <span>
                Total
            </span>

            <strong>
                ${formatPrice(total)}
            </strong>

        </div>
    `;


    checkoutSummary.innerHTML =
        html;
}


/* ============================================================
   SUBMIT ORDER
============================================================ */

checkoutForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!cart.length) {

            alert(
                "Your cart is empty."
            );

            return;
        }


        const name =
            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim();


        const phone =
            document
                .getElementById(
                    "customerPhone"
                )
                .value
                .trim();


        const address =
            document
                .getElementById(
                    "deliveryAddress"
                )
                .value
                .trim();


        const note =
            document
                .getElementById(
                    "customerNote"
                )
                .value
                .trim();


        let total = 0;

        let orderText =
            "NEW ORDER - PRESENT PERFECT STORE\n\n";


        orderText +=
            `Customer: ${name}\n`;

        orderText +=
            `Mobile: ${phone}\n`;

        orderText +=
            `Address: ${address}\n`;


        if (note) {

            orderText +=
                `Note: ${note}\n`;
        }


        orderText +=
            "\nITEMS\n";


        cart.forEach(
            item => {

                const product =
                    findProduct(
                        item.productCode
                    );


                if (!product) {
                    return;
                }


                const price =
                    getProductPrice(
                        product
                    );


                const amount =
                    price *
                    item.quantity;


                total += amount;


                orderText +=
                    `\n${product.name || item.productCode}`;

                orderText +=
                    `\nCode: ${item.productCode}`;

                orderText +=
                    `\nQty: ${item.quantity}`;

                orderText +=
                    `\nPrice: ${formatPrice(price)}`;

                orderText +=
                    `\nAmount: ${formatPrice(amount)}\n`;
            }
        );


        orderText +=
            `\nTOTAL: ${formatPrice(total)}`;


        orderText +=
            "\n\nPayment and delivery to be arranged on WhatsApp.";


        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(
                orderText
            );


        window.open(
            whatsappURL,
            "_blank"
        );
    }
);


/* ============================================================
   SEARCH
============================================================ */

searchInput.addEventListener(
    "input",
    event => {

        searchText =
            event.target.value;

        renderProducts();
    }
);


/* ============================================================
   FORMAT PRICE
============================================================ */

function formatPrice(value) {

    const number =
        Number(value) || 0;


    return (
        CURRENCY +
        number.toLocaleString(
            "en-IN"
        )
    );
}


/* ============================================================
   ESCAPE HTML
============================================================ */

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


/* ============================================================
   TEMPORARY MESSAGE
============================================================ */

function showTemporaryMessage(
    message
) {

    const old =
        document.getElementById(
            "storeToast"
        );


    if (old) {
        old.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.id =
        "storeToast";


    toast.textContent =
        message;


    Object.assign(
        toast.style,
        {

            position: "fixed",

            left: "50%",

            bottom: "25px",

            transform:
                "translateX(-50%)",

            zIndex: "9999",

            background:
                "#211d1a",

            color: "white",

            padding:
                "12px 18px",

            borderRadius:
                "999px",

            fontSize:
                "0.85rem",

            boxShadow:
                "0 8px 30px rgba(0,0,0,.2)"
        }
    );


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        1800
    );
}


/* ============================================================
   YEAR
============================================================ */

document.getElementById(
    "currentYear"
).textContent =
    new Date().getFullYear();


/* ============================================================
   START
============================================================ */

loadCart();

loadProducts();
```

