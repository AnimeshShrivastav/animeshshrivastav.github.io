#!/usr/bin/env python3

import json
import os
import re


# ============================================================
# SETTINGS
# ============================================================

ROOT = os.path.dirname(
    os.path.abspath(__file__)
)

IMAGE_FOLDER = os.path.join(
    ROOT,
    "images"
)

HTML_FILE = os.path.join(
    ROOT,
    "index.html"
)

CSS_FILE = os.path.join(
    ROOT,
    "style.css"
)

JS_FILE = os.path.join(
    ROOT,
    "script.js"
)

SELLER_WHATSAPP = "918902411270"


IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif"
}


# ============================================================
# PRODUCT FILENAME PARSER
#
# Expected:
#
# Necklace_5999.jpg
# Wall_Decor_1499.jpg
# Coffee_Mug_499.jpg
#
# Everything before LAST underscore = category
# Everything after LAST underscore = MRP
# ============================================================

def parse_product_filename(filename):

    name = os.path.splitext(filename)[0]

    parts = name.split("_")

    if len(parts) < 2:
        return None

    price = parts[-1].strip()

    if not price.isdigit():
        return None

    category_parts = parts[:-1]

    category = " ".join(
        category_parts
    )

    category = re.sub(
        r"\s+",
        " ",
        category
    ).strip()

    if not category:
        return None

    return {
        "category": category,
        "price": price
    }


# ============================================================
# FIND PRODUCTS
# ============================================================

def find_products():

    products = []

    if not os.path.isdir(
        IMAGE_FOLDER
    ):

        print(
            f"ERROR: '{IMAGE_FOLDER}' folder does not exist."
        )

        return products

    files = sorted(
        os.listdir(IMAGE_FOLDER),
        key=lambda name: name.lower()
    )

    for filename in files:

        filepath = os.path.join(
            IMAGE_FOLDER,
            filename
        )

        if not os.path.isfile(
            filepath
        ):
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

        # ----------------------------------------------------
        # SERIAL NUMBER
        # ----------------------------------------------------

        serial = len(products) + 1

        serial_string = str(
            serial
        ).zfill(3)

        # ----------------------------------------------------
        # PRODUCT CODE
        # ----------------------------------------------------

        product_code = (
            serial_string
            + "-"
            + parsed["category"]
            + "-"
            + parsed["price"]
        )

        products.append({

            "filename":
                filename,

            "category":
                parsed["category"],

            "price":
                parsed["price"],

            "serial":
                serial_string,

            "productCode":
                product_code

        })

    return products


# ============================================================
# GENERATE PUBLIC HTML
# ============================================================

def generate_html():

    return """<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover">

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


    <div id="products-grid"></div>


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
        aria-modal="true"
        aria-labelledby="orderTitle">


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


        <h2 id="orderTitle">
            Place Your Order
        </h2>


        <p class="modal-subtitle">

            Please provide your details.
            A custom WhatsApp message will
            be prepared for the store.

        </p>


        <div
            id="selectedProduct"
            class="selected-product">

        </div>


        <div class="popup-notice">

            <strong>
                WhatsApp Order
            </strong>

            <p>

                After submitting your details,
                WhatsApp will open with your
                order message. Please review it
                and press Send.

            </p>

        </div>


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
# GENERATE PUBLIC CSS
# ============================================================

def generate_css():

    return r"""
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

    box-sizing:
        border-box;

}


html {

    scroll-behavior:
        smooth;

    -webkit-text-size-adjust:
        100%;

}


body {

    margin:
        0;

    min-width:
        0;

    overflow-x:
        hidden;

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

    z-index:
        10;

}


.header-inner {

    width:
        100%;

    max-width:
        1400px;

    margin:
        0 auto;

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

    min-width:
        0;

}


.brand-symbol {

    flex:
        0 0 auto;

    color:
        var(--gold);

    font-size:
        29px;

}


.brand h1 {

    margin:
        0;

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

    width:
        100%;

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

    content:
        "";

    position:
        absolute;

    inset:
        30px;

    border:
        1px solid
        rgba(184,148,75,.30);

    pointer-events:
        none;

}


.hero::after {

    content:
        "";

    position:
        absolute;

    width:
        500px;

    height:
        500px;

    max-width:
        90vw;

    max-height:
        90vw;

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

    pointer-events:
        none;

}


.hero-content {

    position:
        relative;

    z-index:
        2;

    width:
        100%;

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

    pointer-events:
        none;

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

    width:
        100%;

    max-width:
        1450px;

    margin:
        0 auto;

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

    width:
        100%;

    display:
        grid;

    grid-template-columns:
        repeat(
            auto-fill,
            minmax(240px, 1fr)
        );

    gap:
        28px;

}


/* ============================================================
   PRODUCT CARD
============================================================ */

.product-card {

    min-width:
        0;

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

    width:
        100%;

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

    -webkit-backdrop-filter:
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

    overflow-wrap:
        anywhere;

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

    overflow-wrap:
        anywhere;

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

    min-height:
        42px;

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

    -webkit-backdrop-filter:
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

    -webkit-overflow-scrolling:
        touch;

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

    overflow-wrap:
        anywhere;

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

    max-width:
        100%;

    padding:
        12px;

    border:
        1px solid
        #d7cfbf;

    border-radius:
        0;

    background:
        white;

    color:
        var(--dark);

    font-family:
        var(--sans);

    font-size:
        16px;

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

    min-height:
        48px;

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
   TABLET / MOBILE
============================================================ */

@media (max-width: 700px) {

    .header-inner {

        padding:
            15px 18px;

    }


    .brand {

        gap:
            9px;

    }


    .brand-symbol {

        font-size:
            24px;

    }


    .brand h1 {

        font-size:
            22px;

        letter-spacing:
            2px;

    }


    .brand p {

        font-size:
            8px;

        letter-spacing:
            3px;

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


    .hero-content {

        padding:
            70px 22px;

    }


    .eyebrow {

        font-size:
            8px;

        letter-spacing:
            3px;

    }


    .hero h2 {

        font-size:
            clamp(
                48px,
                15vw,
                75px
            );

    }


    .hero p {

        font-size:
            12px;

        line-height:
            1.8;

    }


    .hero-decoration {

        font-size:
            50px;

    }


    .catalogue {

        padding:
            60px 12px;

    }


    .section-heading {

        margin-bottom:
            35px;

    }


    .section-heading h2 {

        font-size:
            42px;

    }


    .section-heading p {

        font-size:
            11px;

    }


    #products-grid {

        grid-template-columns:
            repeat(
                2,
                minmax(0, 1fr)
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

        line-height:
            1;

    }


    .photo-price {

        font-size:
            12px;

    }


    .photo-serial,
    .photo-code {

        font-size:
            6px;

        letter-spacing:
            1px;

    }


    .product-footer {

        padding:
            9px;

    }


    .buy-button {

        min-height:
            40px;

        padding:
            10px 3px;

        font-size:
            7px;

        letter-spacing:
            1px;

    }


    .modal {

        align-items:
            flex-end;

        padding:
            0;

    }


    .modal-box {

        width:
            100%;

        max-width:
            none;

        max-height:
            94vh;

        padding:
            32px 20px 24px;

    }


    .modal-box h2 {

        font-size:
            34px;

    }


    .site-footer {

        padding:
            45px 15px;

    }


    .footer-brand {

        font-size:
            21px;

        letter-spacing:
            2px;

    }

}


/* ============================================================
   VERY SMALL PHONES
============================================================ */

@media (max-width: 360px) {

    #products-grid {

        grid-template-columns:
            1fr;

    }


    .hero h2 {

        font-size:
            46px;

    }


    .section-heading h2 {

        font-size:
            36px;

    }

}
"""


# ============================================================
# GENERATE PUBLIC JAVASCRIPT
# ============================================================

def generate_js(products):

    products_json = json.dumps(
        products,
        ensure_ascii=False
    )

    return f"""
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
                padding: 60px 20px;
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


            /*
             * Use the actual filename.
             *
             * encodeURIComponent() protects filenames
             * containing spaces or special characters.
             */

            image.src =
                "images/" +
                encodeURIComponent(
                    product.filename
                );


            image.alt =
                product.category;


            image.loading =
                "lazy";


            image.decoding =
                "async";


            // =================================================
            // PHOTO INFORMATION
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
            // FOOTER
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
            ${{escapeHtml(
                product.category
            )}}
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


    document.body.style.overflow =
        "hidden";


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
// CLOSE MODAL
// ============================================================

function closeOrderModal() {{

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


// ============================================================
// CLOSE BUTTON
// ============================================================

closeModalButton.addEventListener(
    "click",
    closeOrderModal
);


// ============================================================
// OVERLAY
// ============================================================

modalOverlay.addEventListener(
    "click",
    closeOrderModal
);


// ============================================================
// ESC KEY
// ============================================================

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
// ORDER FORM
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
        // CREATE MESSAGE
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
        // WHATSAPP URL
        // ----------------------------------------------------

        const whatsappURL =

            "https://wa.me/" +

            SELLER_WHATSAPP +

            "?text=" +

            encodeURIComponent(
                message
            );


        // ----------------------------------------------------
        // CLOSE MODAL FIRST
        // ----------------------------------------------------

        if (
            document.activeElement
        ) {{

            document
                .activeElement
                .blur();

        }}


        closeOrderModal();


        // ----------------------------------------------------
        // OPEN WHATSAPP
        // ----------------------------------------------------

        setTimeout(
            function() {{

                const whatsappWindow =
                    window.open(
                        whatsappURL,
                        "_blank"
                    );


                if (!whatsappWindow) {{

                    alert(
                        "Your browser blocked the WhatsApp window. " +
                        "Please allow popups for this website."
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
# WRITE PUBLIC FILES ONLY
#
# IMPORTANT:
#
# This function deliberately writes ONLY:
#
#   index.html
#   style.css
#   script.js
#
# It does NOT touch:
#
#   admin.html
#   admin.css
#   admin.js
#   admin_server.py
# ============================================================

def write_public_files(products):

    html_content = generate_html()

    css_content = generate_css()

    js_content = generate_js(
        products
    )


    # --------------------------------------------------------
    # INDEX.HTML
    # --------------------------------------------------------

    with open(
        HTML_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(
            html_content
        )


    # --------------------------------------------------------
    # STYLE.CSS
    # --------------------------------------------------------

    with open(
        CSS_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(
            css_content
        )


    # --------------------------------------------------------
    # SCRIPT.JS
    # --------------------------------------------------------

    with open(
        JS_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(
            js_content
        )


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print(
        "================================================"
    )
    print(
        " PRESENT PERFECT STORE"
    )
    print(
        " PUBLIC CATALOGUE GENERATOR"
    )
    print(
        "================================================"
    )
    print()


    # --------------------------------------------------------
    # CHECK IMAGES FOLDER
    # --------------------------------------------------------

    if not os.path.isdir(
        IMAGE_FOLDER
    ):

        print(
            f"ERROR: '{IMAGE_FOLDER}' folder does not exist."
        )

        return 1


    # --------------------------------------------------------
    # FIND PRODUCTS
    # --------------------------------------------------------

    products = find_products()


    print(
        f"Products found : {len(products)}"
    )


    # --------------------------------------------------------
    # GENERATE PUBLIC FILES
    # --------------------------------------------------------

    write_public_files(
        products
    )


    print()
    print(
        "Generated public files:"
    )

    print(
        f"  {os.path.basename(HTML_FILE)}"
    )

    print(
        f"  {os.path.basename(CSS_FILE)}"
    )

    print(
        f"  {os.path.basename(JS_FILE)}"
    )


    print()
    print(
        "Admin files were NOT modified."
    )


    print()
    print(
        "Images folder:"
    )

    print(
        f"  {IMAGE_FOLDER}"
    )


    print()
    print(
        "Filename format:"
    )

    print(
        "  Product_Category_MRP.jpg"
    )


    print()
    print(
        "Catalogue generation completed."
    )

    print()

    return 0


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    raise SystemExit(
        main()
    )

