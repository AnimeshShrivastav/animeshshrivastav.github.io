/* =========================================================
   PRESENT PERFECT ADMIN
   GitHub API
========================================================= */


/* ---------------------------------------------------------
   GITHUB CONFIGURATION
--------------------------------------------------------- */

/*
 * PUT YOUR GITHUB PERSONAL ACCESS TOKEN HERE.
 *
 * Example:
 *
 * const GITHUB_TOKEN =
 *     "github_pat_xxxxxxxxxxxxxxxxx";
 *
 * Do not put "Bearer" here.
 */
const GITHUB_TOKEN =
    "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";
console.log(
    "Token loaded:",
    GITHUB_TOKEN.substring(0, 4),
    "length:",
    GITHUB_TOKEN.length
);


/*
 * GitHub repository.
 */
const GITHUB_REPOSITORY =
    "AnimeshShrivastav/animeshshrivastav.github.io";


/*
 * Folder containing product images.
 */
const IMAGE_FOLDER =
    "images";


/*
 * GitHub branch.
 */
const GITHUB_BRANCH =
    "main";


/* ---------------------------------------------------------
   DOM
--------------------------------------------------------- */

const imageFile =
    document.getElementById(
        "imageFile"
    );


const preview =
    document.getElementById(
        "preview"
    );


const filename =
    document.getElementById(
        "filename"
    );


const uploadButton =
    document.getElementById(
        "uploadButton"
    );


const uploadMessage =
    document.getElementById(
        "uploadMessage"
    );


const refreshButton =
    document.getElementById(
        "refreshButton"
    );


const imageList =
    document.getElementById(
        "imageList"
    );


/* ---------------------------------------------------------
   GITHUB HEADERS
--------------------------------------------------------- */

function githubHeaders() {

    return {

        "Authorization":
            "Bearer " +
            GITHUB_TOKEN.trim(),

        "Accept":
            "application/vnd.github+json",

        "X-GitHub-Api-Version":
            "2022-11-28"

    };
}


/* ---------------------------------------------------------
   GITHUB API URL
--------------------------------------------------------- */

function githubFileURL(
    fileName
) {

    return (
        "https://api.github.com/repos/" +
        GITHUB_REPOSITORY +
        "/contents/" +
        IMAGE_FOLDER +
        "/" +
        encodeURIComponent(
            fileName
        )
    );
}


/* ---------------------------------------------------------
   IMAGE SELECTION
--------------------------------------------------------- */

imageFile.addEventListener(
    "change",
    function () {

        const file =
            imageFile.files[0];


        if (!file) {

            return;
        }


        /*
         * Show preview.
         */
        preview.src =
            URL.createObjectURL(
                file
            );


        preview.hidden =
            false;


        /*
         * Don't automatically use the camera
         * filename.
         *
         * User enters:
         *
         * Product Name_Price
         */
    }
);


/* ---------------------------------------------------------
   VALIDATE INPUT
--------------------------------------------------------- */

function validateAdminInput() {

    if (
        !GITHUB_TOKEN ||
        GITHUB_TOKEN ===
            "YOUR_GITHUB_TOKEN_HERE"
    ) {

        throw new Error(
            "GitHub token has not been added to admin.js."
        );
    }


    if (
        !imageFile.files[0]
    ) {

        throw new Error(
            "Please select or capture an image."
        );
    }


    if (
        !filename.value.trim()
    ) {

        throw new Error(
            "Please enter the product name and price."
        );
    }


    /*
     * Remove extension for validation.
     */
    const baseName =
        filename.value
            .trim()
            .replace(
                /\.(jpg|jpeg|png|webp|gif)$/i,
                ""
            );


    /*
     * There must be exactly ONE underscore.
     *
     * Correct:
     *
     * Blue Shirt_599
     *
     * Incorrect:
     *
     * Blue_Shirt_599
     */
    const underscoreCount =
        (
            baseName.match(
                /_/g
            ) || []
        ).length;


    if (
        underscoreCount !== 1
    ) {

        throw new Error(
            "Use exactly one underscore.\n\n" +
            "Correct example:\n" +
            "Blue Shirt_599"
        );
    }


    const parts =
        baseName.split("_");


    const productName =
        parts[0].trim();


    const priceText =
        parts[1].trim();


    if (!productName) {

        throw new Error(
            "Product name is missing."
        );
    }


    if (!priceText) {

        throw new Error(
            "Price is missing."
        );
    }


    const price =
        Number(
            priceText
        );


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        throw new Error(
            "Price must be a valid number."
        );
    }
}


/* ---------------------------------------------------------
   NORMALIZE FILENAME
--------------------------------------------------------- */

function normalizeFilename(
    name
) {

    /*
     * Remove surrounding whitespace.
     */
    name =
        name.trim();


    /*
     * Remove existing extension.
     */
    name =
        name.replace(
            /\.(jpg|jpeg|png|webp|gif)$/i,
            ""
        );


    /*
     * Remove accidental underscores
     * at beginning/end.
     */
    name =
        name.replace(
            /^_+|_+$/g,
            ""
        );


    /*
     * Collapse accidental multiple underscores.
     *
     * Example:
     *
     * Shirt__599
     *
     * becomes:
     *
     * Shirt_599
     */
    name =
        name.replace(
            /_+/g,
            "_"
        );


    /*
     * GitHub filename will always be JPG.
     */
    return name + ".jpg";
}


/* ---------------------------------------------------------
   GET PRODUCT INFORMATION
--------------------------------------------------------- */

function getProductInformation(
    finalFilename
) {

    const baseName =
        finalFilename.replace(
            /\.jpg$/i,
            ""
        );


    const parts =
        baseName.split("_");


    return {

        name:
            parts[0].trim(),

        price:
            Number(
                parts[1].trim()
            )

    };
}


/* ---------------------------------------------------------
   RESIZE IMAGE
--------------------------------------------------------- */

async function resizeImage(
    file
) {

    const bitmap =
        await createImageBitmap(
            file
        );


    const maximumSize =
        800;


    const scale =
        Math.min(
            1,
            maximumSize /
                Math.max(
                    bitmap.width,
                    bitmap.height
                )
        );


    const width =
        Math.round(
            bitmap.width *
            scale
        );


    const height =
        Math.round(
            bitmap.height *
            scale
        );


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


    /*
     * Better image quality when resizing.
     */
    context.imageSmoothingEnabled =
        true;


    context.imageSmoothingQuality =
        "high";


    context.drawImage(
        bitmap,
        0,
        0,
        width,
        height
    );


    return new Promise(
        resolve => {

            canvas.toBlob(
                blob => {

                    resolve(
                        blob
                    );

                },

                "image/jpeg",

                0.82
            );

        }
    );
}


/* ---------------------------------------------------------
   BLOB TO BASE64
--------------------------------------------------------- */

async function blobToBase64(
    blob
) {

    const arrayBuffer =
        await blob.arrayBuffer();


    const bytes =
        new Uint8Array(
            arrayBuffer
        );


    let binary =
        "";


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


/* ---------------------------------------------------------
   UPLOAD IMAGE
--------------------------------------------------------- */

async function uploadImage() {

    try {

        /* ---------------------------------------------
           VALIDATE
        --------------------------------------------- */

        validateAdminInput();


        uploadMessage.textContent =
            "Preparing image...";


        const file =
            imageFile.files[0];


        /*
         * Create final filename.
         */
        const finalFilename =
            normalizeFilename(
                filename.value
            );


        /*
         * Extract product information.
         */
        const product =
            getProductInformation(
                finalFilename
            );


        console.log(
            "Product:",
            product
        );


        /* ---------------------------------------------
           RESIZE
        --------------------------------------------- */

        uploadMessage.textContent =
            "Resizing image...";


        const resizedBlob =
            await resizeImage(
                file
            );


        if (!resizedBlob) {

            throw new Error(
                "Image resizing failed."
            );
        }


        /* ---------------------------------------------
           CONVERT TO BASE64
        --------------------------------------------- */

        uploadMessage.textContent =
            "Preparing upload...";


        const base64 =
            await blobToBase64(
                resizedBlob
            );


        /* ---------------------------------------------
           GITHUB URL
        --------------------------------------------- */

        const apiURL =
            githubFileURL(
                finalFilename
            );


        /* ---------------------------------------------
           CHECK EXISTING FILE
        --------------------------------------------- */

        uploadMessage.textContent =
            "Checking GitHub...";


        const existingResponse =
            await fetch(
                apiURL,
                {

                    method:
                        "GET",

                    headers:
                        githubHeaders(),

                    cache:
                        "no-store"

                }
            );


        let existingSHA =
            null;


        if (
            existingResponse.ok
        ) {

            const existing =
                await existingResponse.json();


            existingSHA =
                existing.sha;

        }
        else if (
            existingResponse.status !== 404
        ) {

            const error =
                await existingResponse.json();


            throw new Error(
                error.message ||
                "Could not check existing image."
            );

        }


        /* ---------------------------------------------
           UPLOAD
        --------------------------------------------- */

        uploadMessage.textContent =
            existingSHA
                ? "Updating product image..."
                : "Uploading product image...";


        const body = {

            message:
                existingSHA
                    ? "Update product image " +
                      finalFilename
                    : "Add product image " +
                      finalFilename,

            content:
                base64,

            branch:
                GITHUB_BRANCH

        };


        /*
         * GitHub requires the existing SHA
         * when replacing a file.
         */
        if (
            existingSHA
        ) {

            body.sha =
                existingSHA;

        }


        const uploadResponse =
            await fetch(
                apiURL,
                {

                    method:
                        "PUT",

                    headers:
                        {
                            ...githubHeaders(),

                            "Content-Type":
                                "application/json"

                        },

                    body:
                        JSON.stringify(
                            body
                        )

                }
            );


        const result =
            await uploadResponse.json();


        if (
            !uploadResponse.ok
        ) {

            throw new Error(
                result.message ||
                "GitHub upload failed."
            );
        }


        /* ---------------------------------------------
           SUCCESS
        --------------------------------------------- */

        uploadMessage.textContent =
            "SUCCESS!\n\n" +
            finalFilename +
            "\n\n" +
            product.name +
            " — ₹" +
            product.price.toLocaleString(
                "en-IN"
            );


        /*
         * Clear input.
         */
        imageFile.value =
            "";


        filename.value =
            "";


        preview.src =
            "";


        preview.hidden =
            true;


        /*
         * Refresh image list.
         */
        await loadImages();

    }
    catch (error) {

        console.error(
            "UPLOAD ERROR:",
            error
        );


        uploadMessage.textContent =
            "ERROR:\n\n" +
            error.message;
    }
}


/* ---------------------------------------------------------
   LOAD EXISTING IMAGES
--------------------------------------------------------- */

async function loadImages() {

    imageList.innerHTML =
        "Loading...";


    try {

        const url =
            "https://api.github.com/repos/" +
            GITHUB_REPOSITORY +
            "/contents/" +
            IMAGE_FOLDER +
            "?ref=" +
            GITHUB_BRANCH +
            "&t=" +
            Date.now();


        const response =
            await fetch(
                url,
                {

                    method:
                        "GET",

                    headers:
                        githubHeaders(),

                    cache:
                        "no-store"

                }
            );


        if (!response.ok) {

            const error =
                await response.json();


            throw new Error(
                error.message ||
                "Could not read images."
            );
        }


        const files =
            await response.json();


        imageList.innerHTML =
            "";


        if (
            !Array.isArray(files)
        ) {

            throw new Error(
                "GitHub did not return an image list."
            );
        }


        files
            .filter(
                file =>
                    file.type === "file" &&
                    /\.(jpg|jpeg|png|webp|gif)$/i.test(
                        file.name
                    )
            )
            .sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            )
            .forEach(
                file => {

                    createImageRow(
                        file
                    );

                }
            );


        if (
            imageList.children.length === 0
        ) {

            imageList.textContent =
                "No images found.";
        }

    }
    catch (error) {

        console.error(
            "LIST ERROR:",
            error
        );


        imageList.textContent =
            "ERROR: " +
            error.message;
    }
}


/* ---------------------------------------------------------
   CREATE IMAGE ROW
--------------------------------------------------------- */

function createImageRow(
    file
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "image-row";


    /* ---------------------------------------------
       IMAGE
    --------------------------------------------- */

    const image =
        document.createElement(
            "img"
        );


    /*
     * GitHub gives us the correct raw URL.
     */
    image.src =
        file.download_url;


    image.alt =
        file.name;


    image.loading =
        "lazy";


    /* ---------------------------------------------
       NAME
    --------------------------------------------- */

    const name =
        document.createElement(
            "div"
        );


    name.className =
        "image-name";


    name.textContent =
        file.name;


    /* ---------------------------------------------
       DELETE BUTTON
    --------------------------------------------- */

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "delete-button";


    deleteButton.textContent =
        "Delete";


    deleteButton.onclick =
        function () {

            deleteImage(
                file.name,
                file.sha
            );

        };


    /* ---------------------------------------------
       ADD TO ROW
    --------------------------------------------- */

    row.appendChild(
        image
    );


    row.appendChild(
        name
    );


    row.appendChild(
        deleteButton
    );


    imageList.appendChild(
        row
    );
}


/* ---------------------------------------------------------
   DELETE IMAGE
--------------------------------------------------------- */

async function deleteImage(
    name,
    sha
) {

    const confirmed =
        confirm(
            "Delete " +
            name +
            "?"
        );


    if (!confirmed) {

        return;
    }


    try {

        uploadMessage.textContent =
            "Deleting " +
            name +
            "...";


        const url =
            githubFileURL(
                name
            );


        const response =
            await fetch(
                url,
                {

                    method:
                        "DELETE",

                    headers:
                        {
                            ...githubHeaders(),

                            "Content-Type":
                                "application/json"

                        },

                    body:
                        JSON.stringify({

                            message:
                                "Delete product image " +
                                name,

                            sha:
                                sha,

                            branch:
                                GITHUB_BRANCH

                        })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Delete failed."
            );
        }


        uploadMessage.textContent =
            "Deleted:\n" +
            name;


        await loadImages();

    }
    catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        uploadMessage.textContent =
            "DELETE ERROR:\n\n" +
            error.message;
    }
}


/* ---------------------------------------------------------
   BUTTONS
--------------------------------------------------------- */

uploadButton.addEventListener(
    "click",
    uploadImage
);


refreshButton.addEventListener(
    "click",
    loadImages
);


/* ---------------------------------------------------------
   START
--------------------------------------------------------- */

loadImages();
