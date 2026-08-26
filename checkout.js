/* =========================================================
   CHECKOUT
========================================================= */


/* ---------------------------------------------------------
   CONFIGURATION
--------------------------------------------------------- */

const WHATSAPP_NUMBER =
    "918902411270";


const GITHUB_IMAGES_API =
    "https://api.github.com/repos/AnimeshShrivastav/animeshrivastav.github.io/contents/images";


const IMAGE_FOLDER =
    "images";


/* ---------------------------------------------------------
   CART
--------------------------------------------------------- */

let cart =
    JSON.parse(
        localStorage.getItem(
            "presentPerfectCart"
        ) || "[]"
    );


let products = [];


/* ---------------------------------------------------------
   DOM
--------------------------------------------------------- */

const cartItems =
    document.getElementById(
        "cartItems"
    );


const cartTotal =
    document.getElementById(
        "cartTotal"
    );


const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );


const checkoutMessage =
    document.getElementById(
        "checkoutMessage"
    );


/* ---------------------------------------------------------
   PARSE FILENAME
--------------------------------------------------------- */

function parseFilename(filename) {

    const base =
        filename.replace(
            /\.[^/.]+$/,
            ""
        );


    const parts =
        base.split("_");


    const code =
        parts.shift();


    const priceMatch =
        base.match(
            /(?:MRP|PRICE)[-_]?(\d+(?:\.\d+)?)/i
        );


    const price =
        priceMatch
            ? Number(
                priceMatch[1]
            )
            : 0;


    const category =
        parts
            .filter(
                item =>
                    !/^(MRP|PRICE)[-_]?\d+/i.test(
                        item
                    )
            )
            .join(" ");


    return {

        code:

            code,

        name:

            category ||
            code,

        price:

            price,

        image:

            IMAGE_FOLDER +
            "/" +
            encodeURIComponent(
                filename
            )
    };
}


/* ---------------------------------------------------------
   LOAD PRODUCTS
--------------------------------------------------------- */

async function loadProducts() {

    try {

        const response =
            await fetch(
                GITHUB_IMAGES_API +
                "?t=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "GitHub API HTTP " +
                response.status
            );
        }


        const files =
            await response.json();


        products =
            files
                .filter(
                    file =>
                        file.type ===
                            "file" &&
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


        renderCart();

    }
    catch (error) {

        console.error(error);

        checkoutMessage.textContent =
            "Could not load products.";
    }
}


/* ---------------------------------------------------------
   RENDER CART
--------------------------------------------------------- */

function renderCart() {

    cartItems.innerHTML =
        "";


    let total =
        0;


    if (
        cart.length === 0
    ) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        checkoutForm.style.display =
            "none";

        return;
    }


    cart.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.code ===
                        item.code
                );


            if (!product) {

                return;
            }


            const amount =
                product.price *
                item.quantity;


            total +=
                amount;


            const row =
                document.createElement(
                    "div"
                );


            row.style.padding =
                "12px 0";


            row.style.borderBottom =
                "1px solid #ddd";


            row.innerHTML = `

                <strong>
                    ${escapeHTML(product.name)}
                </strong>

                <br>

                Code:
                ${escapeHTML(product.code)}

                <br>

                Quantity:
                ${item.quantity}

                <br>

                Price:
                ₹${product.price.toLocaleString("en-IN")}

                <br>

                Amount:
                ₹${amount.toLocaleString("en-IN")}

                <br><br>

                <button
                    type="button"
                    data-minus="${escapeHTML(product.code)}"
                >
                    −
                </button>

                <button
                    type="button"
                    data-plus="${escapeHTML(product.code)}"
                >
                    +
                </button>

                <button
                    type="button"
                    data-remove="${escapeHTML(product.code)}"
                >
                    Remove
                </button>

            `;


            cartItems.appendChild(
                row
            );

        }
    );


    cartTotal.innerHTML = `

        <h2>
            Total:
            ₹${total.toLocaleString("en-IN")}
        </h2>

    `;


    addCartButtons();
}


/* ---------------------------------------------------------
   CART BUTTONS
--------------------------------------------------------- */

function addCartButtons() {

    document
        .querySelectorAll(
            "[data-minus]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        changeQuantity(
                            button.dataset.minus,
                            -1
                        );
                    };

            }
        );


    document
        .querySelectorAll(
            "[data-plus]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        changeQuantity(
                            button.dataset.plus,
                            1
                        );
                    };

            }
        );


    document
        .querySelectorAll(
            "[data-remove]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        removeItem(
                            button.dataset.remove
                        );
                    };

            }
        );
}


/* ---------------------------------------------------------
   QUANTITY
--------------------------------------------------------- */

function changeQuantity(
    code,
    amount
) {

    const item =
        cart.find(
            x =>
                x.code ===
                code
        );


    if (!item) {

        return;
    }


    item.quantity +=
        amount;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                x =>
                    x.code !==
                    code
            );
    }


    saveCart();

    renderCart();
}


/* ---------------------------------------------------------
   REMOVE
--------------------------------------------------------- */

function removeItem(code) {

    cart =
        cart.filter(
            item =>
                item.code !==
                code
        );


    saveCart();

    renderCart();
}


/* ---------------------------------------------------------
   SAVE
--------------------------------------------------------- */

function saveCart() {

    localStorage.setItem(
        "presentPerfectCart",
        JSON.stringify(
            cart
        )
    );
}


/* ---------------------------------------------------------
   SUBMIT
--------------------------------------------------------- */

checkoutForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (
            cart.length === 0
        ) {

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
                    "customerAddress"
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


        let message =
            "NEW ORDER - PRESENT PERFECT STORE\n\n";


        message +=
            "Customer: " +
            name +
            "\n";


        message +=
            "Mobile: " +
            phone +
            "\n";


        message +=
            "Address: " +
            address +
            "\n";


        if (note) {

            message +=
                "Note: " +
                note +
                "\n";
        }


        message +=
            "\nITEMS\n";


        let total =
            0;


        cart.forEach(
            item => {

                const product =
                    products.find(
                        p =>
                            p.code ===
                            item.code
                    );


                if (!product) {

                    return;
                }


                const amount =
                    product.price *
                    item.quantity;


                total +=
                    amount;


                message +=
                    "\n" +
                    product.name +
                    "\n";


                message +=
                    "Code: " +
                    product.code +
                    "\n";


                message +=
                    "Qty: " +
                    item.quantity +
                    "\n";


                message +=
                    "Price: ₹" +
                    product.price +
                    "\n";


                message +=
                    "Amount: ₹" +
                    amount +
                    "\n";
            }
        );


        message +=
            "\nTOTAL: ₹" +
            total;


        message +=
            "\n\nPayment and delivery will be arranged on WhatsApp.";


        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(
                message
            );


        window.location.href =
            whatsappURL;

    }
);


/* ---------------------------------------------------------
   ESCAPE
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
   START
--------------------------------------------------------- */

loadProducts();
