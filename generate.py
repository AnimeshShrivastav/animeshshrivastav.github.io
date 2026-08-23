import os
import json
import re

# ============================================================
# SETTINGS
# ============================================================

IMAGE_FOLDER = "images"

HTML_FILE = "index.html"
CSS_FILE = "style.css"
JS_FILE = "script.js"

SELLER_WHATSAPP = "918902411270"

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif"
}


# ============================================================
# FIND PRODUCTS
# ============================================================

products = []

if not os.path.isdir(IMAGE_FOLDER):
    print(f"ERROR: '{IMAGE_FOLDER}' folder does not exist.")
    exit(1)


for filename in sorted(os.listdir(IMAGE_FOLDER)):

    filepath = os.path.join(
        IMAGE_FOLDER,
        filename
    )

    if not os.path.isfile(filepath):
        continue

    extension = os.path.splitext(
        filename
    )[1].lower()

    if extension not in IMAGE_EXTENSIONS:
        continue

    name_without_extension = os.path.splitext(
        filename
    )[0]

    parts = name_without_extension.split("_")


    # --------------------------------------------------------
    # Expected:
    #
    # Necklace_001_5999.jpg
    #
    # Category = Necklace
    # Serial   = 001
    # MRP      = 5999
    # --------------------------------------------------------

    if len(parts) >= 3:

        serial = parts[-2]

        price = parts[-1]

        category_parts = parts[:-2]

        category = " ".join(category_parts)

    else:

        category = name_without_extension

        serial = ""

        price = ""


    products.append({

        "filename": filename,

        "category": category,

        "serial": serial,

        "price": price

    })


# ============================================================
# PRODUCT DATA
# ============================================================

products_json = json.dumps(
    products,
    ensure_ascii=False
)


# ============================================================
# INDEX.HTML
# ============================================================

html_content = """<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<meta name="description"
      content="Elegant jewellery collection">

<title>Jewellery Collection</title>

<link
    rel="stylesheet"
    href="style.css">

</head>


<body>


<!-- ========================================================
     HEADER
========================================================= -->

<header class="site-header">

    <div class="header-inner">

        <div class="brand">

            <span class="brand-mark">✦</span>

            <div>

                <h1>ÉLÉGANCE</h1>

                <p>JEWELLERY COLLECTION</p>

            </div>

        </div>


        <div class="header-tagline">

            Timeless Beauty<br>
            <span>Made For You</span>

        </div>

    </div>

</header>


<!-- ========================================================
     HERO
========================================================= -->

<section class="hero">

    <div class="hero-content">

        <span class="hero-small">
            THE ART OF ADORNMENT
        </span>

        <h2>
            Jewellery That<br>
            <em>Tells Your Story</em>
        </h2>

        <p>
            Discover our carefully selected collection
            of elegant pieces designed to celebrate
            life's beautiful moments.
        </p>

        <a
            href="#products"
            class="hero-button">

            Explore Collection

        </a>

    </div>

</section>


<!-- ========================================================
     PRODUCTS
========================================================= -->

<main>

    <section
        class="collection-section"
        id="products">

        <div class="section-heading">

            <span>
                OUR COLLECTION
            </span>

            <h2>
                Timeless Pieces
            </h2>

            <div class="gold-line"></div>

            <p>
                Crafted to make every moment memorable.
            </p>

        </div>


        <div id="products-grid">

        </div>

    </section>

</main>


<!-- ========================================================
     BUY MODAL
========================================================= -->

<div
    id="buyModal"
    class="modal"
    aria-hidden="true">

    <div class="modal-overlay"></div>


    <div class="modal-box">

        <button
            class="modal-close"
            id="modalClose"
            aria-label="Close">

            ×

        </button>


        <div class="modal-icon">
            ✦
        </div>


        <h2>
            Complete Your Order
        </h2>


        <p class="modal-intro">

            Please provide your details.
            A personalized WhatsApp message
            will then be prepared for the seller.

        </p>


        <div
            class="selected-product"
            id="selectedProduct">

        </div>


        <div class="notice">

            <strong>Important</strong>

            <p>
                Please allow popups if your browser
                asks. After submitting your details,
                WhatsApp will open with a custom
                purchase message. Please review it
                and press <strong>Send</strong>.
            </p>

        </div>


        <form id="orderForm">


            <label for="customerName">
                Full Name
            </label>

            <input
                id="customerName"
                type="text"
                placeholder="Your full name"
                required>


            <label for="customerNumber">
                WhatsApp / Mobile Number
            </label>

            <input
                id="customerNumber"
                type="tel"
                placeholder="Your WhatsApp number"
                required>


            <label for="deliveryAddress">
                Delivery Address
            </label>

            <textarea
                id="deliveryAddress"
                rows="4"
                placeholder="Complete delivery address"
                required></textarea>


            <button
                type="submit"
                class="whatsapp-button">

                <span>☏</span>

                Continue to WhatsApp

            </button>

        </form>

    </div>

</div>


<!-- ========================================================
     FOOTER
========================================================= -->

<footer class="site-footer">

    <div class="footer-logo">

        <span>✦</span>

        ÉLÉGANCE

    </div>


    <p>
        Jewellery that celebrates you.
    </p>


    <div class="footer-line"></div>


    <small>
        © 2026 ÉLÉGANCE JEWELLERY
    </small>

</footer>


<script src="script.js"></script>

</body>

</html>
"""


# ============================================================
# STYLE.CSS
# ============================================================

css_content = r"""
/* ============================================================
   FONTS
============================================================ */

@import url(
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap'
);


/* ============================================================
   VARIABLES
============================================================ */

:root {

    --ivory: #faf8f3;

    --cream: #f4efe5;

    --white: #ffffff;

    --gold: #b9954b;

    --gold-light: #d8bd7a;

    --gold-dark: #80662d;

    --charcoal: #292621;

    --muted: #777269;

    --rose: #8f5960;

    --shadow:
        0 15px 50px rgba(70, 50, 20, .10);

    --serif:
        "Cormorant Garamond",
        Georgia,
        serif;

    --sans:
        "Montserrat",
        Arial,
        sans-serif;
}


/* ============================================================
   RESET
============================================================ */

* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {

    margin: 0;

    background: var(--ivory);

    color: var(--charcoal);

    font-family: var(--sans);

    font-weight: 400;
}


/* ============================================================
   HEADER
============================================================ */

.site-header {

    position: relative;

    z-index: 10;

    background:
        rgba(250, 248, 243, .94);

    border-bottom:
        1px solid
        rgba(185,149,75,.25);

    backdrop-filter:
        blur(12px);
}


.header-inner {

    max-width: 1400px;

    margin: auto;

    padding:
        18px 35px;

    display: flex;

    align-items: center;

    justify-content: space-between;
}


.brand {

    display: flex;

    align-items: center;

    gap: 13px;
}


.brand-mark {

    color: var(--gold);

    font-size: 30px;
}


.brand h1 {

    margin: 0;

    font-family: var(--serif);

    font-size: 30px;

    font-weight: 600;

    letter-spacing: 5px;

    line-height: 1;
}


.brand p {

    margin: 6px 0 0;

    color: var(--gold-dark);

    font-size: 8px;

    letter-spacing: 4px;
}


.header-tagline {

    text-align: right;

    color: var(--muted);

    font-size: 10px;

    line-height: 1.7;

    letter-spacing: 2px;
}


.header-tagline span {

    color: var(--gold-dark);
}


/* ============================================================
   HERO
============================================================ */

.hero {

    min-height: 560px;

    display: flex;

    align-items: center;

    justify-content: center;

    text-align: center;

    position: relative;

    overflow: hidden;

    background:

        radial-gradient(
            circle at 50% 45%,
            rgba(255,255,255,.95),
            rgba(244,239,229,.8) 40%,
            rgba(228,215,186,.65) 100%
        );
}


.hero::before {

    content: "";

    position: absolute;

    inset: 30px;

    border:
        1px solid
        rgba(185,149,75,.28);

    pointer-events: none;
}


.hero::after {

    content: "✦";

    position: absolute;

    top: 55px;

    left: 50%;

    transform:
        translateX(-50%);

    color:
        rgba(185,149,75,.35);

    font-size: 26px;
}


.hero-content {

    position: relative;

    z-index: 1;

    max-width: 700px;

    padding: 70px 25px;
}


.hero-small {

    color: var(--gold-dark);

    font-size: 11px;

    letter-spacing: 5px;

    font-weight: 500;
}


.hero h2 {

    margin:
        18px 0;

    font-family: var(--serif);

    font-size:
        clamp(55px, 8vw, 92px);

    line-height: .82;

    font-weight: 500;

    color: var(--charcoal);
}


.hero h2 em {

    color: var(--rose);

    font-weight: 400;
}


.hero p {

    max-width: 520px;

    margin:
        25px auto 30px;

    color: var(--muted);

    font-size: 14px;

    line-height: 1.9;
}


.hero-button {

    display: inline-block;

    padding:
        14px 30px;

    color: white;

    background: var(--charcoal);

    text-decoration: none;

    font-size: 11px;

    letter-spacing: 2px;

    transition:
        background .25s,
        transform .25s;
}


.hero-button:hover {

    background: var(--gold-dark);

    transform:
        translateY(-2px);
}


/* ============================================================
   COLLECTION
============================================================ */

.collection-section {

    max-width: 1450px;

    margin: auto;

    padding:
        85px 30px;
}


.section-heading {

    text-align: center;

    margin-bottom: 50px;
}


.section-heading > span {

    color: var(--gold-dark);

    font-size: 10px;

    letter-spacing: 4px;
}


.section-heading h2 {

    margin:
        10px 0;

    font-family: var(--serif);

    font-size: 52px;

    font-weight: 500;
}


.section-heading p {

    color: var(--muted);

    font-size: 13px;
}


.gold-line {

    width: 55px;

    height: 1px;

    margin: 15px auto;

    background: var(--gold);
}


/* ============================================================
   PRODUCT GRID
============================================================ */

#products-grid {

    display: grid;

    grid-template-columns:
        repeat(
            auto-fill,
            minmax(240px, 1fr)
        );

    gap: 28px;
}


/* ============================================================
   PRODUCT CARD
============================================================ */

.product-card {

    position: relative;

    background: white;

    overflow: hidden;

    box-shadow:
        0 8px 35px
        rgba(60,45,20,.07);

    transition:
        transform .4s ease,
        box-shadow .4s ease;
}


.product-card:hover {

    transform:
        translateY(-8px);

    box-shadow:
        0 20px 50px
        rgba(60,45,20,.15);
}


/* ============================================================
   IMAGE
============================================================ */

.product-image-wrap {

    position: relative;

    overflow: hidden;

    background: #eee8dc;
}


.product-image {

    width: 100%;

    aspect-ratio: 1 / 1.08;

    object-fit: cover;

    display: block;

    transition:
        transform .7s cubic-bezier(.2,.7,.2,1);
}


.product-card:hover
.product-image {

    transform:
        scale(1.07);
}


.image-overlay {

    position: absolute;

    inset: 0;

    background:
        linear-gradient(
            to top,
            rgba(0,0,0,.22),
            transparent 45%
        );

    opacity: 0;

    transition:
        opacity .35s;
}


.product-card:hover
.image-overlay {

    opacity: 1;
}


/* ============================================================
   PRODUCT DETAILS
============================================================ */

.product-details {

    padding:
        20px 20px 22px;

    text-align: center;
}


.product-category {

    margin: 0 0 5px;

    font-family: var(--serif);

    font-size: 25px;

    font-weight: 600;

    color: var(--charcoal);
}


.product-serial {

    margin: 0 0 12px;

    color: #999;

    font-size: 9px;

    letter-spacing: 2px;

    text-transform: uppercase;
}


.product-price {

    margin:
        0 0 17px;

    color: var(--gold-dark);

    font-size: 17px;

    font-weight: 600;
}


.buy-button {

    width: 100%;

    padding: 12px;

    border:
        1px solid
        var(--gold);

    background: transparent;

    color: var(--charcoal);

    cursor: pointer;

    font-family: var(--sans);

    font-size: 10px;

    font-weight: 600;

    letter-spacing: 2px;

    text-transform: uppercase;

    transition:
        background .25s,
        color .25s;
}


.buy-button:hover {

    background: var(--charcoal);

    color: white;

    border-color: var(--charcoal);
}


/* ============================================================
   MODAL
============================================================ */

.modal {

    position: fixed;

    inset: 0;

    z-index: 1000;

    display: none;

    align-items: center;

    justify-content: center;

    padding: 20px;
}


.modal.active {

    display: flex;
}


.modal-overlay {

    position: absolute;

    inset: 0;

    background:
        rgba(35,28,20,.72);

    backdrop-filter:
        blur(6px);
}


.modal-box {

    position: relative;

    z-index: 2;

    width: 100%;

    max-width: 500px;

    max-height: 92vh;

    overflow-y: auto;

    padding: 38px;

    background: var(--ivory);

    box-shadow:
        0 25px 80px
        rgba(0,0,0,.3);

    animation:
        modalIn .3s ease;
}


@keyframes modalIn {

    from {

        opacity: 0;

        transform:
            translateY(25px)
            scale(.98);
    }

    to {

        opacity: 1;

        transform:
            translateY(0)
            scale(1);
    }
}


.modal-close {

    position: absolute;

    top: 12px;

    right: 15px;

    width: 35px;

    height: 35px;

    border: none;

    background: transparent;

    color: #777;

    font-size: 28px;

    cursor: pointer;
}


.modal-icon {

    text-align: center;

    color: var(--gold);

    font-size: 25px;

    margin-bottom: 8px;
}


.modal-box h2 {

    margin:
        0 0 8px;

    text-align: center;

    font-family: var(--serif);

    font-size: 38px;

    font-weight: 500;
}


.modal-intro {

    margin:
        0 auto 20px;

    max-width: 400px;

    text-align: center;

    color: var(--muted);

    font-size: 12px;

    line-height: 1.7;
}


/* ============================================================
   SELECTED PRODUCT
============================================================ */

.selected-product {

    margin:
        15px 0 20px;

    padding:
        14px;

    text-align: center;

    background: white;

    border-left:
        3px solid
        var(--gold);
}


.selected-product strong {

    display: block;

    font-family: var(--serif);

    font-size: 23px;
}


.selected-product span {

    display: block;

    margin-top: 4px;

    color: var(--gold-dark);

    font-size: 12px;
}


/* ============================================================
   NOTICE
============================================================ */

.notice {

    margin-bottom: 22px;

    padding:
        13px 15px;

    background:
        #f3ead6;

    border:
        1px solid
        #e4d4b3;

    color: #665b47;

    font-size: 11px;

    line-height: 1.6;
}


.notice strong {

    color: var(--gold-dark);
}


.notice p {

    margin:
        5px 0 0;
}


/* ============================================================
   FORM
============================================================ */

#orderForm label {

    display: block;

    margin:
        14px 0 6px;

    color: #625d54;

    font-size: 10px;

    font-weight: 600;

    letter-spacing: 1.5px;

    text-transform: uppercase;
}


#orderForm input,
#orderForm textarea {

    width: 100%;

    border:
        1px solid
        #d8d0c1;

    border-radius: 0;

    padding:
        12px 13px;

    background: white;

    color: var(--charcoal);

    font-family: var(--sans);

    font-size: 13px;

    outline: none;

    transition:
        border .2s,
        box-shadow .2s;
}


#orderForm textarea {

    resize: vertical;
}


#orderForm input:focus,
#orderForm textarea:focus {

    border-color: var(--gold);

    box-shadow:
        0 0 0 3px
        rgba(185,149,75,.10);
}


/* ============================================================
   WHATSAPP BUTTON
============================================================ */

.whatsapp-button {

    width: 100%;

    margin-top: 25px;

    padding: 15px;

    border: none;

    background:
        #128c7e;

    color: white;

    cursor: pointer;

    font-family: var(--sans);

    font-size: 11px;

    font-weight: 600;

    letter-spacing: 1.5px;

    transition:
        background .25s,
        transform .25s;
}


.whatsapp-button:hover {

    background:
        #0d6f63;

    transform:
        translateY(-2px);
}


.whatsapp-button span {

    margin-right: 8px;

    font-size: 17px;
}


/* ============================================================
   FOOTER
============================================================ */

.site-footer {

    padding:
        55px 20px;

    text-align: center;

    background:
        #27231f;

    color:
        #cfc6b7;
}


.footer-logo {

    color: #e2c477;

    font-family: var(--serif);

    font-size: 26px;

    letter-spacing: 5px;
}


.footer-logo span {

    color: #d4af37;
}


.site-footer p {

    margin:
        10px 0 25px;

    color: #938a7c;

    font-size: 11px;

    letter-spacing: 2px;
}


.footer-line {

    width: 45px;

    height: 1px;

    margin: auto;

    background: #80662d;
}


.site-footer small {

    display: block;

    margin-top: 20px;

    color: #71695f;

    font-size: 8px;

    letter-spacing: 2px;
}


/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 700px) {

    .header-inner {

        padding:
            16px 18px;
    }


    .brand h1 {

        font-size: 24px;

        letter-spacing: 3px;
    }


    .header-tagline {

        display: none;
    }


    .hero {

        min-height: 500px;
    }


    .hero::before {

        inset: 18px;
    }


    .hero h2 {

        font-size:
            clamp(52px, 15vw, 75px);
    }


    .collection-section {

        padding:
            60px 12px;
    }


    .section-heading h2 {

        font-size: 42px;
    }


    #products-grid {

        grid-template-columns:
            repeat(2, minmax(0,1fr));

        gap: 12px;
    }


    .product-details {

        padding:
            13px 9px 15px;
    }


    .product-category {

        font-size: 20px;
    }


    .product-price {

        font-size: 14px;

        margin-bottom: 12px;
    }


    .buy-button {

        padding: 10px 4px;

        font-size: 8px;

        letter-spacing: 1px;
    }


    .modal-box {

        padding:
            30px 20px;

        max-height: 95vh;
    }
}


/* ============================================================
   VERY SMALL PHONES
============================================================ */

@media (max-width: 360px) {

    #products-grid {

        grid-template-columns: 1fr;
    }
}
"""


# ============================================================
# SCRIPT.JS
# ============================================================

js_content = f"""
// ============================================================
// PRODUCT DATA GENERATED BY PYTHON
// ============================================================

const PRODUCTS = {products_json};


// ============================================================
// SELLER WHATSAPP
// ============================================================

const SELLER_WHATSAPP =
    "{SELLER_WHATSAPP}";


// ============================================================
// ELEMENTS
// ============================================================

const productsGrid =
    document.getElementById("products-grid");

const modal =
    document.getElementById("buyModal");

const modalClose =
    document.getElementById("modalClose");

const modalOverlay =
    document.querySelector(".modal-overlay");

const orderForm =
    document.getElementById("orderForm");

const selectedProduct =
    document.getElementById("selectedProduct");


// Currently selected product

let selectedProductData = null;


// ============================================================
// CREATE PRODUCT CARDS
// ============================================================

function displayProducts() {{

    productsGrid.innerHTML = "";


    if (PRODUCTS.length === 0) {{

        productsGrid.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px;
                color: #777;
            ">
                No jewellery products available.
            </p>
        `;

        return;
    }}


    PRODUCTS.forEach(product => {{

        const card =
            document.createElement("article");

        card.className =
            "product-card";


        // ----------------------------------------------------
        // IMAGE
        // ----------------------------------------------------

        const imageWrap =
            document.createElement("div");

        imageWrap.className =
            "product-image-wrap";


        const image =
            document.createElement("img");

        image.className =
            "product-image";

        image.src =
            "images/" +
            encodeURIComponent(
                product.filename
            );

        image.alt =
            product.category;

        image.loading =
            "lazy";


        const overlay =
            document.createElement("div");

        overlay.className =
            "image-overlay";


        imageWrap.appendChild(image);

        imageWrap.appendChild(overlay);


        // ----------------------------------------------------
        // DETAILS
        // ----------------------------------------------------

        const details =
            document.createElement("div");

        details.className =
            "product-details";


        const category =
            document.createElement("h3");

        category.className =
            "product-category";

        category.textContent =
            product.category;


        const serial =
            document.createElement("p");

        serial.className =
            "product-serial";

        serial.textContent =
            "Product No. " +
            product.serial;


        const price =
            document.createElement("p");

        price.className =
            "product-price";

        price.textContent =
            product.price
                ? "MRP ₹" + product.price
                : "Price on request";


        const buyButton =
            document.createElement("button");

        buyButton.className =
            "buy-button";

        buyButton.type =
            "button";

        buyButton.textContent =
            "Buy This Jewellery";


        buyButton.addEventListener(
            "click",
            () => openBuyModal(product)
        );


        details.appendChild(category);

        details.appendChild(serial);

        details.appendChild(price);

        details.appendChild(buyButton);


        card.appendChild(imageWrap);

        card.appendChild(details);

        productsGrid.appendChild(card);

    }});
}}


// ============================================================
// OPEN BUY MODAL
// ============================================================

function openBuyModal(product) {{

    selectedProductData =
        product;


    selectedProduct.innerHTML = `
        <strong>
            ${{escapeHtml(product.category)}}
        </strong>

        <span>
            Product No. ${{escapeHtml(product.serial)}}
            &nbsp; • &nbsp;
            MRP ₹${{escapeHtml(product.price)}}
        </span>
    `;


    orderForm.reset();


    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(() => {{

        document
            .getElementById("customerName")
            .focus();

    }}, 100);
}}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeModal() {{

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";
}}


modalClose.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    closeModal
);


document.addEventListener(
    "keydown",
    event => {{

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {{

            closeModal();
        }}
    }}
);


// ============================================================
// SUBMIT ORDER
// ============================================================

orderForm.addEventListener(
    "submit",
    function(event) {{

        event.preventDefault();


        if (!selectedProductData) {{
            return;
        }}


        const customerName =
            document
                .getElementById("customerName")
                .value
                .trim();


        const customerNumber =
            document
                .getElementById("customerNumber")
                .value
                .trim();


        const deliveryAddress =
            document
                .getElementById("deliveryAddress")
                .value
                .trim();


        // ----------------------------------------------------
        // Basic validation
        // ----------------------------------------------------

        if (
            customerName === "" ||
            customerNumber === "" ||
            deliveryAddress === ""
        ) {{

            alert(
                "Please complete all the required fields."
            );

            return;
        }}


        const cleanedNumber =
            customerNumber.replace(
                /[^0-9+]/g,
                ""
            );


        if (cleanedNumber.length < 8) {{

            alert(
                "Please enter a valid WhatsApp/mobile number."
            );

            return;
        }}


        // ----------------------------------------------------
        // CUSTOM MESSAGE
        // ----------------------------------------------------

        const message =

            "I, " +

            customerName +

            ", wish to buy the Jewellery Product No. " +

            selectedProductData.category +

            " " +

            selectedProductData.serial +

            " MRP Price ₹" +

            selectedProductData.price +

            ". Kindly deliver the package to my delivery address " +

            deliveryAddress +

            ". For the same pls provide me your QR code scanner for payment";


        // ----------------------------------------------------
        // WHATSAPP URL
        // ----------------------------------------------------

        const whatsappURL =

            "https://wa.me/" +

            SELLER_WHATSAPP +

            "?text=" +

            encodeURIComponent(message);


        // ----------------------------------------------------
        // Close modal first
        // ----------------------------------------------------

        closeModal();


        // ----------------------------------------------------
        // Tell customer what is happening
        // ----------------------------------------------------

        alert(
            "Your custom WhatsApp message is ready.\\\\n\\\\n" +

            "Please allow popups if your browser asks.\\\\n\\\\n" +

            "WhatsApp will now open with your purchase " +
            "message addressed to the seller. " +

            "Please review the message and press Send."
        );


        // ----------------------------------------------------
        // Open WhatsApp
        // ----------------------------------------------------

        const whatsappWindow =
            window.open(
                whatsappURL,
                "_blank"
            );


        // ----------------------------------------------------
        // Popup blocked
        // ----------------------------------------------------

        if (!whatsappWindow) {{

            alert(
                "The browser blocked the WhatsApp popup.\\\\n\\\\n" +

                "Please allow popups for this website " +
                "and click the Buy button again."
            );
        }}

    }}
);


// ============================================================
// HTML ESCAPING
// ============================================================

function escapeHtml(value) {{

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}}


// ============================================================
// START
// ============================================================

displayProducts();
"""


# ============================================================
# WRITE FILES
# ============================================================

with open(
    HTML_FILE,
    "w",
    encoding="utf-8"
) as file:

    file.write(html_content)


with open(
    CSS_FILE,
    "w",
    encoding="utf-8"
) as file:

    file.write(css_content)


with open(
    JS_FILE,
    "w",
    encoding="utf-8"
) as file:

    file.write(js_content)


# ============================================================
# RESULT
# ============================================================

print()
print("==============================================")
print("  JEWELLERY WEBSITE GENERATED SUCCESSFULLY")
print("==============================================")
print()
print(f"Products found : {len(products)}")
print(f"Seller WhatsApp: {SELLER_WHATSAPP}")
print()
print("Generated files:")
print(f"  {HTML_FILE}")
print(f"  {CSS_FILE}")
print(f"  {JS_FILE}")
print()
print("Product images:")
print(f"  {IMAGE_FOLDER}/")
print()
print("Open index.html in your browser.")
print()

