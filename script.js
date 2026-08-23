
// ============================================================
// PRODUCT DATA
// ============================================================

const PRODUCTS = [{"filename": "bangle_1000.png", "category": "bangle", "price": "1000", "serial": "001", "productCode": "001-bangle-1000"}, {"filename": "chocbox_350.png", "category": "chocbox", "price": "350", "serial": "002", "productCode": "002-chocbox-350"}, {"filename": "gift_500.png", "category": "gift", "price": "500", "serial": "003", "productCode": "003-gift-500"}, {"filename": "giftset_700.png", "category": "giftset", "price": "700", "serial": "004", "productCode": "004-giftset-700"}, {"filename": "necklace_2000.png", "category": "necklace", "price": "2000", "serial": "005", "productCode": "005-necklace-2000"}, {"filename": "necklace_3000.png", "category": "necklace", "price": "3000", "serial": "006", "productCode": "006-necklace-3000"}, {"filename": "set_4000.png", "category": "set", "price": "4000", "serial": "007", "productCode": "007-set-4000"}, {"filename": "set_5000.png", "category": "set", "price": "5000", "serial": "008", "productCode": "008-set-5000"}, {"filename": "set_7000.png", "category": "set", "price": "7000", "serial": "009", "productCode": "009-set-7000"}, {"filename": "set_8000.png", "category": "set", "price": "8000", "serial": "010", "productCode": "010-set-8000"}, {"filename": "set_9000.png", "category": "set", "price": "9000", "serial": "011", "productCode": "011-set-9000"}];


// ============================================================
// WHATSAPP
// ============================================================

const SELLER_WHATSAPP =
    "918902411270";


// ============================================================
// ELEMENTS
// ============================================================

const productsGrid =
    document.getElementById(
        "products-grid"
    );

const catalogue =
    document.getElementById(
        "catalogue"
    );

const viewCatalogueButton =
    document.getElementById(
        "viewCatalogueButton"
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
// MOBILE CATALOGUE NAVIGATION
//
// IMPORTANT:
// Do not rely only on href="#catalogue".
// scrollIntoView() is much more reliable here.
// ============================================================

viewCatalogueButton.addEventListener(
    "click",
    function() {

        catalogue.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

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


// ============================================================
// DISPLAY PRODUCTS
// ============================================================

function displayProducts() {

    productsGrid.innerHTML = "";


    if (PRODUCTS.length === 0) {

        productsGrid.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                width: 100%;
                text-align: center;
                padding: 50px 20px;
                color: #777;
            ">

                No products are currently available.

            </div>

        `;

        return;
    }


    PRODUCTS.forEach(
        function(product) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "product-card";


            // =================================================
            // IMAGE
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

            image.decoding =
                "async";


            image.onerror =
                function() {

                    image.style.objectFit =
                        "contain";

                    image.style.padding =
                        "25px";

                };


            // =================================================
            // INFORMATION
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
            // ORDER BUTTON
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
                function() {

                    openOrderModal(
                        product
                    );

                }
            );


            footer.appendChild(
                buyButton
            );


            card.appendChild(
                imageContainer
            );

            card.appendChild(
                footer
            );


            productsGrid.appendChild(
                card
            );

        }
    );
}


// ============================================================
// OPEN MODAL
// ============================================================

function openOrderModal(product) {

    currentProduct =
        product;


    selectedProduct.innerHTML = `

        <strong>
            ${escapeHtml(
                product.category
            )}
        </strong>

        <span>

            MRP ₹${
                escapeHtml(
                    product.price
                )
            }

            &nbsp; • &nbsp;

            Serial No.
            ${
                escapeHtml(
                    product.serial
                )
            }

            &nbsp; • &nbsp;

            Code:
            ${
                escapeHtml(
                    product.productCode
                )
            }

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
        function() {

            document
                .getElementById(
                    "customerName"
                )
                .focus();

        },
        150
    );
}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeOrderModal() {

    if (
        document.activeElement &&
        document.activeElement.blur
    ) {

        document.activeElement.blur();

    }


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
}


closeModalButton.addEventListener(
    "click",
    closeOrderModal
);


modalOverlay.addEventListener(
    "click",
    closeOrderModal
);


// ============================================================
// ESCAPE KEY
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains(
                "active"
            )
        ) {

            closeOrderModal();

        }

    }
);


// ============================================================
// ORDER SUBMISSION
// ============================================================

orderForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        if (!currentProduct) {
            return;
        }


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


        if (
            !customerName ||
            !customerNumber ||
            !deliveryAddress
        ) {

            alert(
                "Please complete all the required fields."
            );

            return;
        }


        const digitsOnly =
            customerNumber.replace(
                /[^0-9]/g,
                ""
            );


        if (
            digitsOnly.length < 8
        ) {

            alert(
                "Please enter a valid WhatsApp/mobile number."
            );

            return;
        }


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


        const whatsappURL =

            "https://wa.me/" +
            SELLER_WHATSAPP +
            "?text=" +
            encodeURIComponent(
                message
            );


        closeOrderModal();


        /*
           Normal location navigation is more reliable
           than window.open on mobile browsers.
        */

        setTimeout(
            function() {

                window.location.href =
                    whatsappURL;

            },
            150
        );

    }
);


// ============================================================
// START
// ============================================================

displayProducts();
