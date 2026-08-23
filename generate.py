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
# PRODUCT PARSER
#
# Expected filename:
#
# Necklace_5999.jpg
# Wall_Decor_1499.jpg
# Coffee_Mug_499.jpg
# Gift_Box_799.jpg
#
# Everything before the LAST underscore = category
# Everything after the LAST underscore = MRP
# ============================================================

def parse_product_filename(filename):

    name = os.path.splitext(filename)[0]

    parts = name.split("_")

    if len(parts) < 2:
        return None

    price = parts[-1].strip()

    category_parts = parts[:-1]

    category = " ".join(category_parts)

    category = re.sub(
        r"\s+",
        " ",
        category
    ).strip()

    # Validate price
    if not price.isdigit():
        return None

    return {
        "category": category,
        "price": price
    }


# ============================================================
# FIND PRODUCTS
# ============================================================

products = []

if not os.path.isdir(IMAGE_FOLDER):

    print(
        f"ERROR: '{IMAGE_FOLDER}' folder does not exist."
    )

    exit(1)


files = sorted(
    os.listdir(IMAGE_FOLDER)
)


for filename in files:

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

    parsed = parse_product_filename(
        filename
    )

    if parsed is None:

        print(
            "WARNING: Skipping invalid filename:",
            filename
        )

        continue


    # --------------------------------------------------------
    # AUTO SERIAL NUMBER
    # --------------------------------------------------------

    serial = len(products) + 1

    serial_string = str(serial).zfill(3)


    # --------------------------------------------------------
    # PRODUCT CODE
    #
    # Example:
    #
    # 001-Necklace-5999
    # --------------------------------------------------------

    product_code = (
        serial_string
        + "-"
        + parsed["category"]
        + "-"
        + parsed["price"]
    )


    products.append({

        "filename": filename,

        "category": parsed["category"],

        "price": parsed["price"],

        "serial": serial_string,

        "productCode": product_code

    })


# ============================================================
# JSON DATA
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

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0">

<meta
    name="description"
    content="Present Perfect Store - The Products Catalogue">

<title>
Present Perfect Store | The Products Catalogue
</title>

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

            <div class="brand-symbol">
                ✦
            </div>

            <div>

                <h1>
                    PRESENT PERFECT
                </h1>

                <p>
                    STORE
                </p>

            </div>

        </div>


        <div class="header-description">

            <span>
                THOUGHTFUL THINGS
            </span>

            <span>
                FOR EVERY SPACE & OCCASION
            </span>

        </div>

    </div>

</header>


<!-- ========================================================
     HERO
========================================================= -->

<section class="hero">

    <div class="hero-decoration left">
        ✦
    </div>

    <div class="hero-content">

        <span class="eyebrow">
            PRESENT PERFECT STORE
        </span>

        <h2>
            The Products
            <em>Catalogue</em>
        </h2>

        <div class="gold-line"></div>

        <p>

            Discover carefully selected products
            for gifting, decorating, celebrating
            and making everyday moments special.

        </p>


        <a
            href="#catalogue"
            class="explore-button">

            VIEW CATALOGUE

        </a>

    </div>


    <div class="hero-decoration right">
        ✦
    </div>

</section>


<!-- ========================================================
     CATALOGUE
========================================================= -->

<main>

<section
    class="catalogue"
    id="catalogue">


    <div class="section-heading">

        <span>
            PRESENT PERFECT STORE
        </span>

        <h2>
            The Products Catalogue
        </h2>

        <div class="heading-line"></div>

        <p>
            Find something perfect for every occasion.
        </p>

    </div>


    <div id="products-grid">

    </div>


</section>

</main>


<!-- ========================================================
     ORDER MODAL
========================================================= -->

<div
    id="orderModal"
    class="modal"
    aria-hidden="true">


    <div class="modal-overlay"></div>


    <div
        class="modal-box"
        role="dialog"
        aria-modal="true">


        <button
            type="button"
            id="closeModal"
            class="modal-close"
            aria-label="Close">

            ×

        </button>


        <div class="modal-symbol">
            ✦
        </div>


        <h2>
            Place Your Order
        </h2>


        <p class="modal-subtitle">

            Please provide your details.
            A custom WhatsApp message will
            be prepared for the store.

        </p>


        <!-- Selected product -->

        <div
            id="selectedProduct"
            class="selected-product">

        </div>


        <!-- Notice -->

        <div class="popup-notice">

            <strong>
                WhatsApp Order
            </strong>

            <p>

                After submitting your details,
                WhatsApp will open with your
                order message. Please review it
                and press <strong>Send</strong>.

                If your browser asks,
                please allow popups for this site.

            </p>

        </div>


        <!-- Order form -->

        <form id="orderForm">


            <label for="customerName">
                Your Name
            </label>

            <input
                id="customerName"
                name="customerName"
                type="text"
                autocomplete="name"
                placeholder="Enter your name"
                required>


            <label for="customerNumber">
                WhatsApp Number
            </label>

            <input
                id="customerNumber"
                name="customerNumber"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                placeholder="Enter your WhatsApp number"
                required>


            <label for="deliveryAddress">
                Delivery Address
            </label>

            <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                autocomplete="street-address"
                rows="4"
                placeholder="Enter complete delivery address"
                required></textarea>


            <button
                type="submit"
                class="whatsapp-button">

                <span>
                    ☏
                </span>

                PREPARE WHATSAPP ORDER

            </button>


        </form>

    </div>

</div>


<!-- ========================================================
     FOOTER
========================================================= -->

<footer class="site-footer">

    <div class="footer-brand">

        <span>
            ✦
        </span>

        PRESENT PERFECT STORE

    </div>


    <p>
        Thoughtful products for every space,
        occasion and moment.
    </p>


    <div class="footer-divider"></div>


    <small>
        © 2026 PRESENT PERFECT STORE
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
@import url(
'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap'
);


/* ============================================================
   VARIABLES
============================================================ */

:root {

    --cream: #faf8f2;

    --cream-dark: #f1ebdf;

    --white: #ffffff;

    --gold: #b8944b;

    --gold-light: #d9bf80;

    --gold-dark: #80652e;

    --dark: #292722;

    --muted: #77736b;

    --rose: #95656b;

    --serif:
        "Cormorant Garamond",
        Georgia,
        serif;

    --sans:
        "Montserrat",
        Arial,
        sans-serif;

    --shadow:
        0 15px 45px
        rgba(60,45,20,.10);
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

    background:
        var(--cream);

    color:
        var(--dark);

    font-family:
        var(--sans);
}


/* ============================================================
   HEADER
============================================================ */

.site-header {

    background:
        rgba(250,248,242,.96);

    border-bottom:
        1px solid
        rgba(184,148,75,.25);

    position:
        relative;

    z-index: 10;
}


.header-inner {

    max-width:
        1400px;

    margin:
        auto;

    padding:
        18px 35px;

    display:
        flex;

    justify-content:
        space-between;

    align-items:
        center;
}


.brand {

    display:
        flex;

    align-items:
        center;

    gap:
        13px;
}


.brand-symbol {

    color:
        var(--gold);

    font-size:
        29px;
}


.brand h1 {

    margin: 0;

    font-family:
        var(--serif);

    font-size:
        29px;

    font-weight:
        600;

    letter-spacing:
        4px;

    line-height:
        1;
}


.brand p {

    margin:
        5px 0 0;

    color:
        var(--gold-dark);

    font-size:
        9px;

    letter-spacing:
        5px;

    text-align:
        center;
}


.header-description {

    text-align:
        right;

    color:
        var(--muted);

    font-size:
        8px;

    letter-spacing:
        2px;

    line-height:
        1.8;
}


.header-description span {

    display:
        block;
}


/* ============================================================
   HERO
============================================================ */

.hero {

    min-height:
        550px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    text-align:
        center;

    position:
        relative;

    overflow:
        hidden;

    background:

        radial-gradient(
            circle at center,
            #ffffff 0%,
            #f6f0e4 48%,
            #e6d9bd 100%
        );
}


.hero::before {

    content: "";

    position:
        absolute;

    inset:
        30px;

    border:
        1px solid
        rgba(184,148,75,.30);
}


.hero::after {

    content: "";

    position:
        absolute;

    width:
        500px;

    height:
        500px;

    border-radius:
        50%;

    border:
        1px solid
        rgba(184,148,75,.10);

    top:
        50%;

    left:
        50%;

    transform:
        translate(-50%,-50%);
}


.hero-content {

    position:
        relative;

    z-index:
        2;

    max-width:
        750px;

    padding:
        80px 25px;
}


.eyebrow {

    color:
        var(--gold-dark);

    font-size:
        10px;

    letter-spacing:
        5px;

    font-weight:
        500;
}


.hero h2 {

    margin:
        18px 0;

    font-family:
        var(--serif);

    font-size:
        clamp(55px, 8vw, 88px);

    font-weight:
        500;

    line-height:
        .85;
}


.hero h2 em {

    display:
        block;

    color:
        var(--rose);

    font-weight:
        400;
}


.gold-line {

    width:
        55px;

    height:
        1px;

    margin:
        25px auto;

    background:
        var(--gold);
}


.hero p {

    max-width:
        560px;

    margin:
        0 auto 30px;

    color:
        var(--muted);

    font-size:
        13px;

    line-height:
        1.9;
}


.explore-button {

    display:
        inline-block;

    padding:
        14px 30px;

    color:
        white;

    background:
        var(--dark);

    text-decoration:
        none;

    font-size:
        9px;

    font-weight:
        500;

    letter-spacing:
        2px;

    transition:
        .25s;
}


.explore-button:hover {

    background:
        var(--gold-dark);

    transform:
        translateY(-2px);
}


.hero-decoration {

    position:
        absolute;

    color:
        rgba(184,148,75,.25);

    font-size:
        80px;
}


.hero-decoration.left {

    left:
        8%;

    top:
        30%;
}


.hero-decoration.right {

    right:
        8%;

    bottom:
        20%;
}


/* ============================================================
   CATALOGUE
============================================================ */

.catalogue {

    max-width:
        1450px;

    margin:
        auto;

    padding:
        85px 30px;
}


.section-heading {

    text-align:
        center;

    margin-bottom:
        55px;
}


.section-heading > span {

    color:
        var(--gold-dark);

    font-size:
        9px;

    letter-spacing:
        4px;
}


.section-heading h2 {

    margin:
        10px 0;

    font-family:
        var(--serif);

    font-size:
        52px;

    font-weight:
        500;
}


.heading-line {

    width:
        50px;

    height:
        1px;

    margin:
        15px auto;

    background:
        var(--gold);
}


.section-heading p {

    color:
        var(--muted);

    font-size:
        12px;
}


/* ============================================================
   PRODUCT GRID
============================================================ */

#products-grid {

    display:
        grid;

    grid-template-columns:
        repeat(
            auto-fill,
            minmax(240px,1fr)
        );

    gap:
        28px;
}


/* ============================================================
   PRODUCT CARD
============================================================ */

.product-card {

    background:
        var(--white);

    box-shadow:
        0 8px 35px
        rgba(60,45,20,.07);

    overflow:
        hidden;

    transition:
        transform .4s ease,
        box-shadow .4s ease;
}


.product-card:hover {

    transform:
        translateY(-8px);

    box-shadow:
        0 20px 55px
        rgba(60,45,20,.15);
}


/* ============================================================
   IMAGE
============================================================ */

.product-image-container {

    position:
        relative;

    overflow:
        hidden;

    background:
        #eee8dc;
}


.product-image {

    width:
        100%;

    aspect-ratio:
        1 / 1.05;

    object-fit:
        cover;

    display:
        block;

    transition:
        transform .7s ease;
}


.product-card:hover
.product-image {

    transform:
        scale(1.06);
}


/* ============================================================
   IMAGE TAG
============================================================ */

.photo-tag {

    position:
        absolute;

    left:
        12px;

    right:
        12px;

    bottom:
        12px;

    padding:
        13px 14px;

    background:
        rgba(255,255,255,.93);

    backdrop-filter:
        blur(7px);

    border:
        1px solid
        rgba(184,148,75,.35);

    text-align:
        center;

    box-shadow:
        0 5px 20px
        rgba(0,0,0,.08);
}


.photo-category {

    margin:
        0 0 5px;

    font-family:
        var(--serif);

    font-size:
        24px;

    font-weight:
        600;

    color:
        var(--dark);
}


.photo-price {

    margin:
        0;

    color:
        var(--gold-dark);

    font-size:
        14px;

    font-weight:
        600;
}


.photo-serial {

    margin-top:
        7px;

    color:
        #777;

    font-size:
        8px;

    letter-spacing:
        2px;

    text-transform:
        uppercase;
}


.photo-code {

    margin-top:
        5px;

    color:
        #999;

    font-family:
        monospace;

    font-size:
        8px;

    word-break:
        break-all;
}


/* ============================================================
   CARD FOOTER
============================================================ */

.product-footer {

    padding:
        15px;
}


.buy-button {

    width:
        100%;

    padding:
        12px;

    border:
        1px solid
        var(--gold);

    background:
        transparent;

    color:
        var(--dark);

    cursor:
        pointer;

    font-family:
        var(--sans);

    font-size:
        9px;

    font-weight:
        600;

    letter-spacing:
        2px;

    transition:
        .25s;
}


.buy-button:hover {

    background:
        var(--dark);

    color:
        white;

    border-color:
        var(--dark);
}


/* ============================================================
   MODAL
============================================================ */

.modal {

    position:
        fixed;

    inset:
        0;

    z-index:
        1000;

    display:
        none;

    align-items:
        center;

    justify-content:
        center;

    padding:
        20px;
}


.modal.active {

    display:
        flex;
}


.modal-overlay {

    position:
        absolute;

    inset:
        0;

    background:
        rgba(30,25,20,.75);

    backdrop-filter:
        blur(6px);
}


.modal-box {

    position:
        relative;

    z-index:
        2;

    width:
        100%;

    max-width:
        500px;

    max-height:
        92vh;

    overflow-y:
        auto;

    padding:
        35px;

    background:
        var(--cream);

    box-shadow:
        0 30px 90px
        rgba(0,0,0,.35);

    animation:
        modalIn .25s ease;
}


@keyframes modalIn {

    from {

        opacity:
            0;

        transform:
            translateY(20px);
    }

    to {

        opacity:
            1;

        transform:
            translateY(0);
    }
}


.modal-close {

    position:
        absolute;

    top:
        10px;

    right:
        14px;

    border:
        none;

    background:
        transparent;

    color:
        #777;

    font-size:
        28px;

    cursor:
        pointer;
}


.modal-symbol {

    text-align:
        center;

    color:
        var(--gold);

    font-size:
        25px;
}


.modal-box h2 {

    margin:
        5px 0;

    text-align:
        center;

    font-family:
        var(--serif);

    font-size:
        38px;

    font-weight:
        500;
}


.modal-subtitle {

    margin:
        0 auto 20px;

    max-width:
        400px;

    text-align:
        center;

    color:
        var(--muted);

    font-size:
        11px;

    line-height:
        1.7;
}


/* ============================================================
   SELECTED PRODUCT
============================================================ */

.selected-product {

    padding:
        14px;

    margin-bottom:
        18px;

    background:
        white;

    border-left:
        3px solid
        var(--gold);

    text-align:
        center;
}


.selected-product strong {

    display:
        block;

    font-family:
        var(--serif);

    font-size:
        23px;
}


.selected-product span {

    display:
        block;

    margin-top:
        5px;

    color:
        var(--gold-dark);

    font-size:
        11px;
}


/* ============================================================
   NOTICE
============================================================ */

.popup-notice {

    margin-bottom:
        20px;

    padding:
        12px 14px;

    background:
        #f3ead7;

    border:
        1px solid
        #e1cfaa;

    color:
        #665c4c;

    font-size:
        10px;

    line-height:
        1.6;
}


.popup-notice p {

    margin:
        5px 0 0;
}


/* ============================================================
   FORM
============================================================ */

#orderForm label {

    display:
        block;

    margin:
        13px 0 6px;

    color:
        #625c53;

    font-size:
        9px;

    font-weight:
        600;

    letter-spacing:
        1.5px;

    text-transform:
        uppercase;
}


#orderForm input,
#orderForm textarea {

    width:
        100%;

    padding:
        12px;

    border:
        1px solid
        #d7cfbf;

    background:
        white;

    color:
        var(--dark);

    font-family:
        var(--sans);

    font-size:
        12px;

    outline:
        none;
}


#orderForm input:focus,
#orderForm textarea:focus {

    border-color:
        var(--gold);

    box-shadow:
        0 0 0 3px
        rgba(184,148,75,.10);
}


#orderForm textarea {

    resize:
        vertical;
}


.whatsapp-button {

    width:
        100%;

    margin-top:
        22px;

    padding:
        15px;

    border:
        none;

    background:
        #128c7e;

    color:
        white;

    cursor:
        pointer;

    font-family:
        var(--sans);

    font-size:
        10px;

    font-weight:
        600;

    letter-spacing:
        1.5px;

    transition:
        .25s;
}


.whatsapp-button:hover {

    background:
        #0d7065;
}


.whatsapp-button span {

    margin-right:
        7px;

    font-size:
        16px;
}


/* ============================================================
   FOOTER
============================================================ */

.site-footer {

    padding:
        55px 20px;

    text-align:
        center;

    background:
        #292622;

    color:
        #cfc5b4;
}


.footer-brand {

    font-family:
        var(--serif);

    font-size:
        27px;

    letter-spacing:
        4px;

    color:
        #dfc77f;
}


.footer-brand span {

    color:
        #d3aa52;
}


.site-footer p {

    margin:
        10px 0 25px;

    color:
        #92897b;

    font-size:
        10px;

    letter-spacing:
        1px;
}


.footer-divider {

    width:
        45px;

    height:
        1px;

    margin:
        auto;

    background:
        var(--gold-dark);
}


.site-footer small {

    display:
        block;

    margin-top:
        20px;

    color:
        #6e675d;

    font-size:
        8px;

    letter-spacing:
        2px;
}


/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 700px) {

    .header-inner {

        padding:
            15px 18px;
    }


    .brand h1 {

        font-size:
            23px;

        letter-spacing:
            2px;
    }


    .header-description {

        display:
            none;
    }


    .hero {

        min-height:
            500px;
    }


    .hero::before {

        inset:
            18px;
    }


    .hero h2 {

        font-size:
            clamp(
                50px,
                15vw,
                75px
            );
    }


    .hero-decoration {

        font-size:
            50px;
    }


    .catalogue {

        padding:
            60px 12px;
    }


    .section-heading h2 {

        font-size:
            42px;
    }


    #products-grid {

        grid-template-columns:
            repeat(
                2,
                minmax(0,1fr)
            );

        gap:
            12px;
    }


    .photo-tag {

        left:
            7px;

        right:
            7px;

        bottom:
            7px;

        padding:
            9px 5px;
    }


    .photo-category {

        font-size:
            18px;
    }


    .photo-price {

        font-size:
            12px;
    }


    .photo-serial,
    .photo-code {

        font-size:
            7px;
    }


    .product-footer {

        padding:
            9px;
    }


    .buy-button {

        padding:
            10px 3px;

        font-size:
            7px;

        letter-spacing:
            1px;
    }


    .modal-box {

        padding:
            30px 20px;

        max-height:
            95vh;
    }
}


/* ============================================================
   SMALL PHONE
============================================================ */

@media (max-width: 360px) {

    #products-grid {

        grid-template-columns:
            1fr;
    }
}
"""


# ============================================================
# SCRIPT.JS
# ============================================================

js_content = f"""
// ============================================================
// PRODUCT DATA
// ============================================================

const PRODUCTS = {products_json};


// ============================================================
// STORE WHATSAPP
// ============================================================

const SELLER_WHATSAPP =
    "{SELLER_WHATSAPP}";


// ============================================================
// ELEMENTS
// ============================================================

const productsGrid =
    document.getElementById(
        "products-grid"
    );

const modal =
    document.getElementById(
        "orderModal"
    );

const modalOverlay =
    document.querySelector(
        ".modal-overlay"
    );

const closeModalButton =
    document.getElementById(
        "closeModal"
    );

const orderForm =
    document.getElementById(
        "orderForm"
    );

const selectedProduct =
    document.getElementById(
        "selectedProduct"
    );


// Currently selected product

let currentProduct = null;


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {{

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
}}


// ============================================================
// DISPLAY PRODUCTS
// ============================================================

function displayProducts() {{

    productsGrid.innerHTML = "";


    if (PRODUCTS.length === 0) {{

        productsGrid.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px;
                color: #777;
            ">

                No products are currently available.

            </div>

        `;

        return;
    }}


    PRODUCTS.forEach(
        product => {{

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "product-card";


            // =================================================
            // IMAGE CONTAINER
            // =================================================

            const imageContainer =
                document.createElement(
                    "div"
                );

            imageContainer.className =
                "product-image-container";


            const image =
                document.createElement(
                    "img"
                );

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


            // =================================================
            // PHOTO INFORMATION TAG
            // =================================================

            const photoTag =
                document.createElement(
                    "div"
                );

            photoTag.className =
                "photo-tag";


            const category =
                document.createElement(
                    "div"
                );

            category.className =
                "photo-category";

            category.textContent =
                product.category;


            const price =
                document.createElement(
                    "div"
                );

            price.className =
                "photo-price";

            price.textContent =
                "MRP ₹" +
                product.price;


            const serial =
                document.createElement(
                    "div"
                );

            serial.className =
                "photo-serial";

            serial.textContent =
                "Serial No. " +
                product.serial;


            const code =
                document.createElement(
                    "div"
                );

            code.className =
                "photo-code";

            code.textContent =
                "Code: " +
                product.productCode;


            photoTag.appendChild(
                category
            );

            photoTag.appendChild(
                price
            );

            photoTag.appendChild(
                serial
            );

            photoTag.appendChild(
                code
            );


            imageContainer.appendChild(
                image
            );

            imageContainer.appendChild(
                photoTag
            );


            // =================================================
            // BUY BUTTON
            // =================================================

            const footer =
                document.createElement(
                    "div"
                );

            footer.className =
                "product-footer";


            const buyButton =
                document.createElement(
                    "button"
                );

            buyButton.type =
                "button";

            buyButton.className =
                "buy-button";

            buyButton.textContent =
                "ORDER THIS PRODUCT";


            buyButton.addEventListener(
                "click",
                function() {{

                    openOrderModal(
                        product
                    );

                }}
            );


            footer.appendChild(
                buyButton
            );


            // =================================================
            // CARD
            // =================================================

            card.appendChild(
                imageContainer
            );

            card.appendChild(
                footer
            );


            productsGrid.appendChild(
                card
            );

        }}
    );
}}


// ============================================================
// OPEN ORDER MODAL
// ============================================================

function openOrderModal(product) {{

    currentProduct =
        product;


    selectedProduct.innerHTML = `

        <strong>
            ${{escapeHtml(product.category)}}
        </strong>

        <span>

            MRP ₹${{
                escapeHtml(
                    product.price
                )
            }}

            &nbsp; • &nbsp;

            Serial No.
            ${{
                escapeHtml(
                    product.serial
                )
            }}

            &nbsp; • &nbsp;

            Code:
            ${{
                escapeHtml(
                    product.productCode
                )
            }}

        </span>

    `;


    orderForm.reset();


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
       Prevent page scrolling while
       the order window is open.
    */

    document.body.style.overflow =
        "hidden";


    /*
       Focus the first field after
       the modal is visible.
    */

    setTimeout(
        function() {{

            document
                .getElementById(
                    "customerName"
                )
                .focus();

        }},
        100
    );
}}


// ============================================================
// CLOSE ORDER MODAL
// ============================================================

function closeOrderModal() {{

    /*
       Remove focus from any input.

       This helps prevent the mobile
       keyboard from remaining active.
    */

    if (
        document.activeElement
    ) {{

        document
            .activeElement
            .blur();

    }}


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    currentProduct =
        null;
}}


closeModalButton.addEventListener(
    "click",
    closeOrderModal
);


modalOverlay.addEventListener(
    "click",
    closeOrderModal
);


document.addEventListener(
    "keydown",
    function(event) {{

        if (
            event.key === "Escape" &&
            modal.classList.contains(
                "active"
            )
        ) {{

            closeOrderModal();

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


        if (!currentProduct) {{
            return;
        }}


        const customerName =
            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim();


        const customerNumber =
            document
                .getElementById(
                    "customerNumber"
                )
                .value
                .trim();


        const deliveryAddress =
            document
                .getElementById(
                    "deliveryAddress"
                )
                .value
                .trim();


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (
            !customerName ||
            !customerNumber ||
            !deliveryAddress
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


        if (
            cleanedNumber.length < 8
        ) {{

            alert(
                "Please enter a valid WhatsApp/mobile number."
            );

            return;
        }}


        // ----------------------------------------------------
        // CREATE ORDER MESSAGE
        // ----------------------------------------------------

        const message =

            "I, " +

            customerName +

            ", wish to buy Product Code " +

            currentProduct.productCode +

            " (" +

            currentProduct.category +

            ", MRP ₹" +

            currentProduct.price +

            "). " +

            "My WhatsApp number is " +

            customerNumber +

            ". " +

            "Kindly deliver the package to my delivery address: " +

            deliveryAddress +

            ". " +

            "For the same, please provide me your QR code scanner for payment.";


        // ----------------------------------------------------
        // CREATE WHATSAPP URL
        // ----------------------------------------------------

        const whatsappURL =

            "https://wa.me/" +

            SELLER_WHATSAPP +

            "?text=" +

            encodeURIComponent(
                message
            );


        // ----------------------------------------------------
        // IMPORTANT MOBILE UX
        //
        // Remove focus and close modal BEFORE
        // opening WhatsApp.
        // ----------------------------------------------------

        if (
            document.activeElement
        ) {{

            document
                .activeElement
                .blur();

        }}


        closeOrderModal();


        /*
           Small delay allows the keyboard to
           disappear before opening WhatsApp.
        */

        setTimeout(
            function() {{

                const whatsappWindow =
                    window.open(
                        whatsappURL,
                        "_blank"
                    );


                /*
                   Popup blocked
                */

                if (!whatsappWindow) {{

                    alert(
                        "Your browser blocked the WhatsApp window. " +

                        "Please allow popups for this website " +

                        "and try again."
                    );

                }}

            }},
            150
        );

    }}
);


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

    file.write(
        html_content
    )


with open(
    CSS_FILE,
    "w",
    encoding="utf-8"
) as file:

    file.write(
        css_content
    )


with open(
    JS_FILE,
    "w",
    encoding="utf-8"
) as file:

    file.write(
        js_content
    )


# ============================================================
# SUMMARY
# ============================================================

print()
print("================================================")
print(" PRESENT PERFECT STORE")
print(" PRODUCT CATALOGUE GENERATED")
print("================================================")
print()

print(
    f"Products found : {len(products)}"
)

print(
    f"WhatsApp       : {SELLER_WHATSAPP}"
)

print()

print("Generated:")

print(
    f"  {HTML_FILE}"
)

print(
    f"  {CSS_FILE}"
)

print(
    f"  {JS_FILE}"
)

print()

print("Filename format:")
print(
    "  Product_Category_MRP.jpg"
)

print()

print("Examples:")
print(
    "  Necklace_5999.jpg"
)

print(
    "  Wall_Decor_1499.jpg"
)

print(
    "  Coffee_Mug_499.jpg"
)

print()

print("Open index.html to view the catalogue.")
print()

