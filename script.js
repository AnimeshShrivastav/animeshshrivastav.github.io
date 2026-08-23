
// ============================================================
// PRODUCT DATA
// ============================================================

const PRODUCTS = [{"filename": "bangle_1000.png", "category": "bangle", "price": "1000", "serial": "001", "productCode": "001-bangle-1000"}, {"filename": "necklace_2000.png", "category": "necklace", "price": "2000", "serial": "002", "productCode": "002-necklace-2000"}, {"filename": "necklace_3000.png", "category": "necklace", "price": "3000", "serial": "003", "productCode": "003-necklace-3000"}, {"filename": "set_4000.png", "category": "set", "price": "4000", "serial": "004", "productCode": "004-set-4000"}, {"filename": "set_5000.png", "category": "set", "price": "5000", "serial": "005", "productCode": "005-set-5000"}, {"filename": "set_7000.png", "category": "set", "price": "7000", "serial": "006", "productCode": "006-set-7000"}, {"filename": "set_8000.png", "category": "set", "price": "8000", "serial": "007", "productCode": "007-set-8000"}, {"filename": "set_9000.png", "category": "set", "price": "9000", "serial": "008", "productCode": "008-set-9000"}];


// ============================================================
// STORE WHATSAPP
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
                text-align: center;
                padding: 60px;
                color: #777;
            ">

                No products are currently available.

            </div>

        `;

        return;
    }


    PRODUCTS.forEach(
        product => {

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
                function() {

                    openOrderModal(
                        product
                    );

                }
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

        }
    );
}


// ============================================================
// OPEN ORDER MODAL
// ============================================================

function openOrderModal(product) {

    currentProduct =
        product;


    selectedProduct.innerHTML = `

        <strong>
            ${escapeHtml(product.category)}
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
        function() {

            document
                .getElementById(
                    "customerName"
                )
                .focus();

        },
        100
    );
}


// ============================================================
// CLOSE ORDER MODAL
// ============================================================

function closeOrderModal() {

    /*
       Remove focus from any input.

       This helps prevent the mobile
       keyboard from remaining active.
    */

    if (
        document.activeElement
    ) {

        document
            .activeElement
            .blur();

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
// SUBMIT ORDER
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


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

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


        const cleanedNumber =
            customerNumber.replace(
                /[^0-9+]/g,
                ""
            );


        if (
            cleanedNumber.length < 8
        ) {

            alert(
                "Please enter a valid WhatsApp/mobile number."
            );

            return;
        }


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
        ) {

            document
                .activeElement
                .blur();

        }


        closeOrderModal();


        /*
           Small delay allows the keyboard to
           disappear before opening WhatsApp.
        */

        setTimeout(
            function() {

                const whatsappWindow =
                    window.open(
                        whatsappURL,
                        "_blank"
                    );


                /*
                   Popup blocked
                */

                if (!whatsappWindow) {

                    alert(
                        "Your browser blocked the WhatsApp window. " +

                        "Please allow popups for this website " +

                        "and try again."
                    );

                }

            },
            150
        );

    }
);


// ============================================================
// START
// ============================================================

displayProducts();
