/* ============================================================
   PRESENT PERFECT STORE
   STATIC GITHUB ADMIN
   NO PYTHON
   NO FLASK
   NO DATABASE
============================================================ */


/* ============================================================
   CONFIGURATION
============================================================ */

const PRODUCTS_PATH =
    "products.json";


const IMAGE_FOLDER =
    "images/thumbnails";


const IMAGE_WIDTH =
    600;


const IMAGE_QUALITY =
    0.82;


const GITHUB_API =
    "https://api.github.com";


/* ============================================================
   STATE
============================================================ */

let products = [];

let editingCode = null;

let selectedImage = null;


/* ============================================================
   DOM
============================================================ */

const ownerInput =
    document.getElementById(
        "githubOwner"
    );


const repoInput =
    document.getElementById(
        "githubRepo"
    );


const branchInput =
    document.getElementById(
        "githubBranch"
    );


const tokenInput =
    document.getElementById(
        "githubToken"
    );


const connectButton =
    document.getElementById(
        "connectButton"
    );


const disconnectButton =
    document.getElementById(
        "disconnectButton"
    );


const connectionStatus =
    document.getElementById(
        "connectionStatus"
    );


const productForm =
    document.getElementById(
        "productForm"
    );


const productCode =
    document.getElementById(
        "productCode"
    );


const productName =
    document.getElementById(
        "productName"
    );


const productCategory =
    document.getElementById(
        "productCategory"
    );


const productPrice =
    document.getElementById(
        "productPrice"
    );


const productOldPrice =
    document.getElementById(
        "productOldPrice"
    );


const productTag =
    document.getElementById(
        "productTag"
    );


const productDescription =
    document.getElementById(
        "productDescription"
    );


const productImage =
    document.getElementById(
        "productImage"
    );


const imagePreview =
    document.getElementById(
        "imagePreview"
    );


const imagePreviewContainer =
    document.getElementById(
        "imagePreviewContainer"
    );


const newProductButton =
    document.getElementById(
        "newProductButton"
    );


const productTable =
    document.getElementById(
        "productTable"
    );


const catalogueCount =
    document.getElementById(
        "catalogueCount"
    );


const adminSearch =
    document.getElementById(
        "adminSearch"
    );


const reloadButton =
    document.getElementById(
        "reloadButton"
    );


const statusLog =
    document.getElementById(
        "statusLog"
    );


const editingStatus =
    document.getElementById(
        "editingStatus"
    );


/* ============================================================
   SESSION STORAGE
============================================================ */

function loadSettings() {

    ownerInput.value =
        sessionStorage.getItem(
            "githubOwner"
        ) || "";


    repoInput.value =
        sessionStorage.getItem(
            "githubRepo"
        ) || "";


    branchInput.value =
        sessionStorage.getItem(
            "githubBranch"
        ) || "main";


    tokenInput.value =
        sessionStorage.getItem(
            "githubToken"
        ) || "";
}


/* ============================================================
   SAVE SETTINGS
============================================================ */

function saveSettings() {

    sessionStorage.setItem(
        "githubOwner",
        ownerInput.value.trim()
    );


    sessionStorage.setItem(
        "githubRepo",
        repoInput.value.trim()
    );


    sessionStorage.setItem(
        "githubBranch",
        branchInput.value.trim() ||
        "main"
    );


    sessionStorage.setItem(
        "githubToken",
        tokenInput.value.trim()
    );
}


/* ============================================================
   GITHUB CONFIG
============================================================ */

function getConfig() {

    return {

        owner:
            ownerInput.value.trim(),

        repo:
            repoInput.value.trim(),

        branch:
            branchInput.value.trim() ||
            "main",

        token:
            tokenInput.value.trim()
    };
}


/* ============================================================
   VALIDATE CONFIG
============================================================ */

function validateConfig() {

    const config =
        getConfig();


    if (!config.owner) {

        throw new Error(
            "GitHub owner is missing."
        );
    }


    if (!config.repo) {

        throw new Error(
            "GitHub repository is missing."
        );
    }


    if (!config.token) {

        throw new Error(
            "GitHub token is missing."
        );
    }


    return config;
}


/* ============================================================
   GITHUB REQUEST
============================================================ */

async function githubRequest(
    path,
    options = {}
) {

    const config =
        validateConfig();


    const response =
        await fetch(
            GITHUB_API +
            path,
            {

                ...options,

                headers: {

                    "Accept":
                        "application/vnd.github+json",

                    "Authorization":
                        `Bearer ${config.token}`,

                    "X-GitHub-Api-Version":
                        "2026-03-10",

                    ...(options.headers || {})
                }
            }
        );


    let data = null;


    try {

        data =
            await response.json();

    } catch {

        data = null;
    }


    if (!response.ok) {

        const message =
            data?.message ||
            `GitHub error ${response.status}`;


        throw new Error(
            message
        );
    }


    return data;
}


/* ============================================================
   GET REPOSITORY FILE
============================================================ */

async function getGitHubFile(
    path
) {

    const config =
        validateConfig();


    const encodedPath =
        path
            .split("/")
            .map(
                encodeURIComponent
            )
            .join("/");


    return githubRequest(
        `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath}?ref=${encodeURIComponent(config.branch)}`
    );
}


/* ============================================================
   DECODE GITHUB CONTENT
============================================================ */

function decodeBase64(
    base64
) {

    const binary =
        atob(
            base64.replace(
                /\n/g,
                ""
            )
        );


    const bytes =
        new Uint8Array(
            binary.length
        );


    for (
        let i = 0;
        i < binary.length;
        i++
    ) {

        bytes[i] =
            binary.charCodeAt(i);
    }


    return new TextDecoder(
        "utf-8"
    ).decode(
        bytes
    );
}


/* ============================================================
   ENCODE UTF-8 TO BASE64
============================================================ */

function encodeBase64(
    text
) {

    const bytes =
        new TextEncoder()
            .encode(
                text
            );


    let binary = "";


    const chunkSize =
        0x8000;


    for (
        let i = 0;
        i < bytes.length;
        i += chunkSize
    ) {

        binary +=
            String.fromCharCode(
                ...bytes.subarray(
                    i,
                    i + chunkSize
                )
            );
    }


    return btoa(
        binary
    );
}


/* ============================================================
   UPLOAD / UPDATE GITHUB FILE
============================================================ */

async function putGitHubFile(
    path,
    contentBase64,
    message,
    existingSha = null
) {

    const config =
        validateConfig();


    const encodedPath =
        path
            .split("/")
            .map(
                encodeURIComponent
            )
            .join("/");


    const body = {

        message:
            message,

        content:
            contentBase64,

        branch:
            config.branch
    };


    if (existingSha) {

        body.sha =
            existingSha;
    }


    return githubRequest(

        `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath}`,

        {

            method:
                "PUT",

            body:
                JSON.stringify(
                    body
                )
        }
    );
}


/* ============================================================
   CONNECT
============================================================ */

connectButton.addEventListener(
    "click",
    async () => {

        try {

            validateConfig();

            saveSettings();


            setConnectionStatus(
                "Connecting...",
                false
            );


            log(
                "Connecting to GitHub..."
            );


            await getGitHubFile(
                PRODUCTS_PATH
            );


            setConnectionStatus(
                "Connected",
                true
            );


            log(
                "GitHub connection successful."
            );


            await loadProducts();


        } catch (error) {

            setConnectionStatus(
                "Connection failed",
                false
            );


            log(
                "ERROR: " +
                error.message
            );
        }
    }
);


/* ============================================================
   DISCONNECT
============================================================ */

disconnectButton.addEventListener(
    "click",
    () => {

        sessionStorage.removeItem(
            "githubToken"
        );

        tokenInput.value =
            "";

        setConnectionStatus(
            "Not connected",
            false
        );

        log(
            "GitHub token removed from this browser session."
        );
    }
);


/* ============================================================
   CONNECTION STATUS
============================================================ */

function setConnectionStatus(
    text,
    connected
) {

    connectionStatus.textContent =
        text;


    connectionStatus.className =
        connected
            ? "status connected"
            : "status disconnected";
}


/* ============================================================
   LOAD PRODUCTS FROM GITHUB
============================================================ */

async function loadProducts() {

    try {

        const file =
            await getGitHubFile(
                PRODUCTS_PATH
            );


        const json =
            decodeBase64(
                file.content
            );


        const data =
            JSON.parse(
                json
            );


        products =
            Array.isArray(data)
                ? data
                : [];


        renderProductTable();


        log(
            `Loaded ${products.length} products.`
        );


    } catch (error) {

        /*
           404 means products.json does not exist.
           We will create it when the first product is saved.
        */

        if (
            error.message
                .toLowerCase()
                .includes(
                    "not found"
                )
        ) {

            products = [];

            renderProductTable();


            log(
                "products.json does not exist yet. It will be created when you save the first product."
            );


            return;
        }


        throw error;
    }
}


/* ============================================================
   SAVE PRODUCTS.JSON
============================================================ */

async function saveProducts() {

    let existingSha =
        null;


    try {

        const file =
            await getGitHubFile(
                PRODUCTS_PATH
            );


        existingSha =
            file.sha;

    } catch (error) {

        if (
            !error.message
                .toLowerCase()
                .includes(
                    "not found"
                )
        ) {

            throw error;
        }
    }


    const json =
        JSON.stringify(
            products,
            null,
            4
        );


    const encoded =
        encodeBase64(
            json
        );


    await putGitHubFile(

        PRODUCTS_PATH,

        encoded,

        existingSha
            ? "Update products.json"
            : "Create products.json",

        existingSha
    );


    log(
        "products.json saved successfully."
    );
}


/* ============================================================
   PRODUCT FORM SUBMIT
============================================================ */

productForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        try {

            validateConfig();


            const code =
                productCode.value
                    .trim();


            const name =
                productName.value
                    .trim();


            const category =
                productCategory.value
                    .trim();


            const price =
                Number(
                    productPrice.value
                );


            const oldPrice =
                Number(
                    productOldPrice.value
                ) || 0;


            const tag =
                productTag.value
                    .trim();


            const description =
                productDescription.value
                    .trim();


            if (!code) {

                throw new Error(
                    "Product code is required."
                );
            }


            if (!name) {

                throw new Error(
                    "Product name is required."
                );
            }


            if (!category) {

                throw new Error(
                    "Category is required."
                );
            }


            if (
                !Number.isFinite(price) ||
                price < 0
            ) {

                throw new Error(
                    "Invalid price."
                );
            }


            /*
               Check duplicate codes.
            */

            const existingIndex =
                products.findIndex(
                    product =>
                        String(
                            product.product_code
                        ).toLowerCase() ===
                        code.toLowerCase()
                );


            /*
               If adding a new product,
               duplicate codes are not allowed.
            */

            if (
                editingCode === null &&
                existingIndex !== -1
            ) {

                throw new Error(
                    "This product code already exists."
                );
            }


            const product = {

                product_code:
                    code,

                name:
                    name,

                category:
                    category,

                price:
                    price,

                old_price:
                    oldPrice,

                tag:
                    tag,

                description:
                    description
            };


            /*
               Upload image first if selected.
            */

            if (selectedImage) {

                log(
                    "Preparing thumbnail..."
                );


                const imageBlob =
                    await createThumbnail(
                        selectedImage
                    );


                log(
                    "Uploading thumbnail to GitHub..."
                );


                await uploadThumbnail(
                    code,
                    imageBlob
                );


                product.image =
                    `${IMAGE_FOLDER}/${code}.jpg`;


                log(
                    "Thumbnail uploaded."
                );
            }


            /*
               EDIT
            */

            if (
                editingCode !== null
            ) {

                const index =
                    products.findIndex(
                        item =>
                            String(
                                item.product_code
                            ) ===
                            String(
                                editingCode
                            )
                    );


                if (index === -1) {

                    throw new Error(
                        "Product being edited was not found."
                    );
                }


                /*
                   Preserve old image if
                   no new image was selected.
                */

                if (
                    !product.image &&
                    products[index].image
                ) {

                    product.image =
                        products[index].image;
                }


                products[index] =
                    product;


                log(
                    "Product information updated."
                );

            } else {

                products.push(
                    product
                );


                log(
                    "New product added."
                );
            }


            /*
               Save JSON
            */

            log(
                "Updating products.json..."
            );


            await saveProducts();


            /*
               Reset
            */

            resetProductForm();


            renderProductTable();


            log(
                "PRODUCT SAVED SUCCESSFULLY."
            );


        } catch (error) {

            log(
                "ERROR: " +
                error.message
            );


            alert(
                error.message
            );
        }
    }
);


/* ============================================================
   IMAGE FILE
============================================================ */

productImage.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {

            selectedImage =
                null;

            imagePreviewContainer.hidden =
                true;

            return;
        }


        selectedImage =
            file;


        const reader =
            new FileReader();


        reader.onload =
            event => {

                imagePreview.src =
                    event.target.result;

                imagePreviewContainer.hidden =
                    false;
            };


        reader.readAsDataURL(
            file
        );
    }
);


/* ============================================================
   CREATE THUMBNAIL
============================================================ */

async function createThumbnail(
    file
) {

    const bitmap =
        await createImageBitmap(
            file
        );


    let width =
        bitmap.width;


    let height =
        bitmap.height;


    /*
       Keep maximum dimension at 600px.
    */

    if (
        width > IMAGE_WIDTH ||
        height > IMAGE_WIDTH
    ) {

        if (
            width >= height
        ) {

            height =
                Math.round(
                    height *
                    IMAGE_WIDTH /
                    width
                );

            width =
                IMAGE_WIDTH;

        } else {

            width =
                Math.round(
                    width *
                    IMAGE_WIDTH /
                    height
                );

            height =
                IMAGE_WIDTH;
        }
    }


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        width;

    canvas.height =
        height;


    const context =
        canvas.getContext(
            "2d"
        );


    context.drawImage(
        bitmap,
        0,
        0,
        width,
        height
    );


    return new Promise(
        (resolve, reject) => {

            canvas.toBlob(
                blob => {

                    if (blob) {

                        resolve(
                            blob
                        );

                    } else {

                        reject(
                            new Error(
                                "Could not create thumbnail."
                            )
                        );
                    }

                },

                "image/jpeg",

                IMAGE_QUALITY
            );
        }
    );
}


/* ============================================================
   BLOB TO BASE64
============================================================ */

function blobToBase64(
    blob
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onloadend =
                () => {

                    const result =
                        reader.result;


                    const base64 =
                        result.split(
                            ","
                        )[1];


                    resolve(
                        base64
                    );
                };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                blob
            );
        }
    );
}


/* ============================================================
   UPLOAD THUMBNAIL
============================================================ */

async function uploadThumbnail(
    code,
    blob
) {

    const path =
        `${IMAGE_FOLDER}/${code}.jpg`;


    let existingSha =
        null;


    try {

        const existing =
            await getGitHubFile(
                path
            );


        existingSha =
            existing.sha;

    } catch (error) {

        if (
            !error.message
                .toLowerCase()
                .includes(
                    "not found"
                )
        ) {

            throw error;
        }
    }


    const base64 =
        await blobToBase64(
            blob
        );


    await putGitHubFile(

        path,

        base64,

        existingSha
            ? `Update thumbnail ${code}`
            : `Add thumbnail ${code}`,

        existingSha
    );
}


/* ============================================================
   RENDER PRODUCT TABLE
============================================================ */

function renderProductTable() {

    const search =
        adminSearch.value
            .trim()
            .toLowerCase();


    const filtered =
        products.filter(
            product => {

                const text =
                    [
                        product.product_code,
                        product.name,
                        product.category,
                        product.tag
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                return text.includes(
                    search
                );
            }
        );


    catalogueCount.textContent =
        `${products.length} product` +
        (
            products.length === 1
                ? ""
                : "s"
        );


    productTable.innerHTML =
        "";


    if (!filtered.length) {

        productTable.innerHTML = `

            <div class="help-text">

                No products found.

            </div>
        `;

        return;
    }


    filtered.forEach(
        product => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "product-row";


            const code =
                product.product_code ||
                "";


            const image =
                product.image ||
                `${IMAGE_FOLDER}/${code}.jpg`;


            row.innerHTML = `

                <div class="product-row-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt=""
                        loading="lazy"
                        onerror="this.style.display='none'"
                    >

                </div>


                <div class="product-row-info">

                    <h3>
                        ${escapeHTML(
                            product.name ||
                            "Unnamed"
                        )}
                    </h3>

                    <p>
                        Code:
                        ${escapeHTML(code)}
                    </p>

                    <p>
                        ${escapeHTML(
                            product.category ||
                            ""
                        )}
                        ·
                        ₹${Number(
                            product.price || 0
                        ).toLocaleString("en-IN")}
                    </p>

                </div>


                <div class="product-row-actions">

                    <button
                        type="button"
                        class="small-button edit-button"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="small-button delete-button"
                    >
                        Delete
                    </button>

                </div>
            `;


            row.querySelector(
                ".edit-button"
            ).addEventListener(
                "click",
                () =>
                    editProduct(code)
            );


            row.querySelector(
                ".delete-button"
            ).addEventListener(
                "click",
                () =>
                    deleteProduct(code)
            );


            productTable.appendChild(
                row
            );
        }
    );
}


/* ============================================================
   EDIT PRODUCT
============================================================ */

function editProduct(
    code
) {

    const product =
        products.find(
            item =>
                String(
                    item.product_code
                ) ===
                String(code)
        );


    if (!product) {
        return;
    }


    editingCode =
        code;


    productCode.value =
        product.product_code ||
        "";


    productName.value =
        product.name ||
        "";


    productCategory.value =
        product.category ||
        "";


    productPrice.value =
        product.price ??
        "";


    productOldPrice.value =
        product.old_price ??
        "";


    productTag.value =
        product.tag ||
        "";


    productDescription.value =
        product.description ||
        "";


    selectedImage =
        null;


    productImage.value =
        "";


    editingStatus.textContent =
        `Editing ${code}`;


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );


    log(
        `Editing product ${code}.`
    );
}


/* ============================================================
   DELETE PRODUCT
============================================================ */

async function deleteProduct(
    code
) {

    const product =
        products.find(
            item =>
                String(
                    item.product_code
                ) ===
                String(code)
        );


    if (!product) {
        return;
    }


    const confirmed =
        confirm(
            `Delete ${product.name || code}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        products =
            products.filter(
                item =>
                    String(
                        item.product_code
                    ) !==
                    String(code)
            );


        await saveProducts();


        renderProductTable();


        log(
            `Product ${code} deleted from products.json.`
        );


    } catch (error) {

        log(
            "ERROR: " +
            error.message
        );


        alert(
            error.message
        );


        await loadProducts();
    }
}


/* ============================================================
   NEW PRODUCT
============================================================ */

newProductButton.addEventListener(
    "click",
    resetProductForm
);


function resetProductForm() {

    editingCode =
        null;


    selectedImage =
        null;


    productForm.reset();


    editingStatus.textContent =
        "New product";


    imagePreviewContainer.hidden =
        true;


    imagePreview.src =
        "";


    log(
        "Ready for a new product."
    );
}


/* ============================================================
   SEARCH
============================================================ */

adminSearch.addEventListener(
    "input",
    renderProductTable
);


/* ============================================================
   RELOAD
============================================================ */

reloadButton.addEventListener(
    "click",
    async () => {

        try {

            await loadProducts();

        } catch (error) {

            log(
                "ERROR: " +
                error.message
            );
        }
    }
);


/* ============================================================
   LOG
============================================================ */

function log(
    message
) {

    const now =
        new Date()
            .toLocaleTimeString();


    statusLog.textContent =
        `[${now}] ${message}\n` +
        statusLog.textContent;
}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHTML(
    value
) {

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
   INITIALIZATION
============================================================ */

loadSettings();


/*
   If a previous session exists,
   don't automatically send the token anywhere.
   Just show that settings are available.
*/

if (
    tokenInput.value &&
    ownerInput.value &&
    repoInput.value
) {

    log(
        "Previous GitHub session found. Click Connect to continue."
    );
}
