/* =========================================================
   PRESENT PERFECT ADMIN
   GitHub API — Image Upload / Update / Delete
========================================================= */


/* ---------------------------------------------------------
   GITHUB CONFIGURATION
--------------------------------------------------------- */

/*
 * IMPORTANT:
 *
 * NEVER commit your real GitHub token to a public repository.
 *
 * Replace this with your NEW token for testing.
 *
 * Required fine-grained token permission:
 *
 * Repository access:
 *   Only select repositories
 *   → AnimeshShrivastav/animeshshrivastav.github.io
 *
 * Repository permissions:
 *   Contents → Read and write
 *
 * IMPORTANT:
 * A browser-side token is NOT secure for a public website.
 * For production, move GitHub API calls to a backend/serverless
 * function so the token is never exposed to visitors.
 */

const GITHUB_TOKEN =
    "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";


const GITHUB_REPOSITORY =
    "AnimeshShrivastav/animeshshrivastav.github.io";


const IMAGE_FOLDER =
    "images";


const GITHUB_BRANCH =
    "main";


/* ---------------------------------------------------------
   DOM
--------------------------------------------------------- */

const imageFile =
    document.getElementById("imageFile");

const preview =
    document.getElementById("preview");

const filename =
    document.getElementById("filename");

const uploadButton =
    document.getElementById("uploadButton");

const uploadMessage =
    document.getElementById("uploadMessage");

const refreshButton =
    document.getElementById("refreshButton");

const imageList =
    document.getElementById("imageList");


/* ---------------------------------------------------------
   CHECK DOM
--------------------------------------------------------- */

console.log(
    "ADMIN DOM CHECK:",
    {
        imageFile: !!imageFile,
        preview: !!preview,
        filename: !!filename,
        uploadButton: !!uploadButton,
        uploadMessage: !!uploadMessage,
        refreshButton: !!refreshButton,
        imageList: !!imageList
    }
);


/* ---------------------------------------------------------
   TOKEN CHECK
--------------------------------------------------------- */

function tokenConfigured() {

    return (
        typeof GITHUB_TOKEN === "string" &&
        GITHUB_TOKEN.trim() !== "" &&
        GITHUB_TOKEN.trim() !== "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"
    );
}


/* ---------------------------------------------------------
   GITHUB HEADERS
--------------------------------------------------------- */

function githubHeaders() {

    if (!tokenConfigured()) {

        throw new Error(
            "GitHub token has not been configured."
        );
    }

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

function githubFileURL(fileName) {

    const safeFileName =
        encodeURIComponent(fileName);

    return (
        "https://api.github.com/repos/" +
        GITHUB_REPOSITORY +
        "/contents/" +
        IMAGE_FOLDER +
        "/" +
        safeFileName
    );
}


/* ---------------------------------------------------------
   GITHUB ERROR HANDLER
--------------------------------------------------------- */

async function githubError(response) {

    let data = {};

    try {

        data =
            await response.json();

    }
    catch (error) {

        console.warn(
            "Could not parse GitHub error response.",
            error
        );

    }


    console.error(
        "GITHUB API ERROR:",
        {
            status: response.status,
            statusText: response.statusText,
            response: data
        }
    );


    let message =
        data.message ||
        response.statusText ||
        "Unknown GitHub error.";


    if (response.status === 401) {

        message =
            "GitHub authentication failed: Bad credentials.\n\n" +
            "Create a NEW fine-grained token and make sure it is copied correctly.\n\n" +
            "Required:\n" +
            "Repository access → your repository\n" +
            "Contents → Read and write";
    }


    else if (response.status === 403) {

        message =
            "GitHub permission denied (403).\n\n" +
            "Make sure the token has:\n" +
            "Contents → Read and write\n\n" +
            "If this is an organization repository, check whether the organization requires token approval.";
    }


    else if (response.status === 404) {

        message =
            "GitHub returned 404.\n\n" +
            "Check the repository name, branch, image folder, and repository access granted to the token.";
    }


    return new Error(message);
}


/* ---------------------------------------------------------
   TEST GITHUB AUTHENTICATION
--------------------------------------------------------- */

async function testGitHubAuthentication() {

    console.group(
        "GITHUB AUTHENTICATION TEST"
    );


    try {

        if (!tokenConfigured()) {

            throw new Error(
                "GitHub token has not been configured."
            );
        }


        const url =
            "https://api.github.com/repos/" +
            GITHUB_REPOSITORY;


        console.log(
            "Testing repository:",
            GITHUB_REPOSITORY
        );


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    headers: githubHeaders(),
                    cache: "no-store"
                }
            );


        console.log(
            "AUTH TEST RESPONSE:",
            {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            }
        );


        if (!response.ok) {

            throw await githubError(
                response
            );
        }


        const data =
            await response.json();


        console.log(
            "GITHUB AUTHENTICATION SUCCESS:",
            {
                repository:
                    data.full_name,

                private:
                    data.private,

                defaultBranch:
                    data.default_branch
            }
        );


        return data;

    }
    finally {

        console.groupEnd();

    }
}


/* ---------------------------------------------------------
   IMAGE SELECTION
--------------------------------------------------------- */

if (imageFile) {

    imageFile.addEventListener(
        "change",
        function () {

            const file =
                imageFile.files[0];


            if (!file) {

                return;
            }


            console.log(
                "IMAGE SELECTED:",
                {
                    name: file.name,
                    type: file.type,
                    size: file.size
                }
            );


            if (
                !file.type.startsWith("image/")
            ) {

                uploadMessage.textContent =
                    "ERROR:\n\nPlease select an image file.";

                imageFile.value = "";

                return;
            }


            preview.src =
                URL.createObjectURL(file);


            preview.hidden =
                false;

        }
    );

}


/* ---------------------------------------------------------
   VALIDATE INPUT
--------------------------------------------------------- */

function validateAdminInput() {

    if (!tokenConfigured()) {

        throw new Error(
            "GitHub token has not been configured."
        );
    }


    if (
        !imageFile ||
        !imageFile.files[0]
    ) {

        throw new Error(
            "Please select or capture an image."
        );
    }


    if (
        !filename ||
        !filename.value.trim()
    ) {

        throw new Error(
            "Please enter the product name and price."
        );
    }


    const baseName =
        filename.value
            .trim()
            .replace(
                /\.(jpg|jpeg|png|webp|gif)$/i,
                ""
            );


    const underscoreCount =
        (
            baseName.match(/_/g) || []
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
        Number(priceText);


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        throw new Error(
            "Price must be a valid number."
        );
    }


    return {
        productName,
        price
    };
}


/* ---------------------------------------------------------
   NORMALIZE FILENAME
--------------------------------------------------------- */

function normalizeFilename(name) {

    name =
        name.trim();


    name =
        name.replace(
            /\.(jpg|jpeg|png|webp|gif)$/i,
            ""
        );


    name =
        name.replace(
            /^_+|_+$/g,
            ""
        );


    name =
        name.replace(
            /_+/g,
            "_"
        );


    /*
     * All uploaded images become JPG.
     */
    return name + ".jpg";
}


/* ---------------------------------------------------------
   GET PRODUCT INFORMATION
--------------------------------------------------------- */

function getProductInformation(finalFilename) {

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

async function resizeImage(file) {

    console.log(
        "STARTING IMAGE RESIZE:",
        file.name
    );


    const bitmap =
        await createImageBitmap(file);


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
            bitmap.width * scale
        );


    const height =
        Math.round(
            bitmap.height * scale
        );


    const canvas =
        document.createElement("canvas");


    canvas.width =
        width;


    canvas.height =
        height;


    const context =
        canvas.getContext("2d");


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


    bitmap.close();


    return new Promise(
        (resolve, reject) => {

            canvas.toBlob(
                blob => {

                    if (!blob) {

                        reject(
                            new Error(
                                "Image resizing failed."
                            )
                        );

                        return;
                    }


                    console.log(
                        "IMAGE RESIZED:",
                        {
                            width,
                            height,
                            size: blob.size,
                            type: blob.type
                        }
                    );


                    resolve(blob);

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

async function blobToBase64(blob) {

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


    return btoa(binary);
}


/* ---------------------------------------------------------
   UPLOAD / UPDATE IMAGE
--------------------------------------------------------- */

async function uploadImage() {

    console.group(
        "UPLOAD IMAGE"
    );


    try {

        const input =
            validateAdminInput();


        uploadMessage.textContent =
            "Preparing image...";


        const file =
            imageFile.files[0];


        const finalFilename =
            normalizeFilename(
                filename.value
            );


        const product =
            getProductInformation(
                finalFilename
            );


        uploadMessage.textContent =
            "Resizing image...";


        const resizedBlob =
            await resizeImage(file);


        uploadMessage.textContent =
            "Preparing upload...";


        const base64 =
            await blobToBase64(
                resizedBlob
            );


        const apiURL =
            githubFileURL(
                finalFilename
            );


        /* ---------------------------------------------
           CHECK WHETHER FILE EXISTS
        --------------------------------------------- */

        uploadMessage.textContent =
            "Checking GitHub...";


        const existingResponse =
            await fetch(
                apiURL,
                {
                    method: "GET",
                    headers: githubHeaders(),
                    cache: "no-store"
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


            console.log(
                "EXISTING FILE FOUND:",
                {
                    name:
                        existing.name,

                    sha:
                        existing.sha
                }
            );

        }


        else if (
            existingResponse.status !== 404
        ) {

            throw await githubError(
                existingResponse
            );

        }


        /* ---------------------------------------------
           CREATE / UPDATE
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
         * GitHub requires SHA when updating.
         */
        if (existingSHA) {

            body.sha =
                existingSHA;

        }


        const uploadResponse =
            await fetch(
                apiURL,
                {
                    method: "PUT",

                    headers: {
                        ...githubHeaders(),

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)
                }
            );


        if (!uploadResponse.ok) {

            throw await githubError(
                uploadResponse
            );

        }


        const result =
            await uploadResponse.json();


        console.log(
            "UPLOAD SUCCESS:",
            result
        );


        uploadMessage.textContent =
            "SUCCESS!\n\n" +
            finalFilename +
            "\n\n" +
            product.name +
            " — ₹" +
            product.price.toLocaleString(
                "en-IN"
            );


        /* ---------------------------------------------
           CLEAR INPUT
        --------------------------------------------- */

        imageFile.value =
            "";


        filename.value =
            "";


        preview.src =
            "";


        preview.hidden =
            true;


        /* ---------------------------------------------
           REFRESH
        --------------------------------------------- */

        await loadImages();

    }

    catch (error) {

        console.error(
            "UPLOAD ERROR:",
            error
        );


        uploadMessage.textContent =
            "ERROR:\n\n" +
            (
                error?.message ||
                "Unknown error."
            );

    }

    finally {

        console.groupEnd();

    }
}


/* ---------------------------------------------------------
   LOAD EXISTING IMAGES
--------------------------------------------------------- */

async function loadImages() {

    console.group(
        "LOAD GITHUB IMAGES"
    );


    if (!imageList) {

        console.error(
            "imageList element not found."
        );

        return;
    }


    imageList.innerHTML =
        "Loading...";


    try {

        const url =
            "https://api.github.com/repos/" +
            GITHUB_REPOSITORY +
            "/contents/" +
            IMAGE_FOLDER +
            "?ref=" +
            encodeURIComponent(
                GITHUB_BRANCH
            );


        const response =
            await fetch(
                url,
                {
                    method: "GET",
                    headers: githubHeaders(),
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw await githubError(
                response
            );

        }


        const files =
            await response.json();


        if (!Array.isArray(files)) {

            throw new Error(
                "GitHub did not return an image list."
            );
        }


        imageList.innerHTML =
            "";


        const imageFiles =
            files
                .filter(
                    file =>
                        file.type === "file" &&
                        /\.(jpg|jpeg|png|webp|gif)$/i
                            .test(file.name)
                )
                .sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                );


        imageFiles.forEach(
            file => {

                createImageRow(file);

            }
        );


        if (
            imageFiles.length === 0
        ) {

            imageList.textContent =
                "No images found.";

        }


        console.log(
            "IMAGE LIST LOADED:",
            imageFiles.length
        );

    }

    catch (error) {

        console.error(
            "LOAD IMAGES ERROR:",
            error
        );


        imageList.textContent =
            "ERROR: " +
            (
                error?.message ||
                "Unknown error."
            );

    }

    finally {

        console.groupEnd();

    }
}


/* ---------------------------------------------------------
   CREATE IMAGE ROW
--------------------------------------------------------- */

function createImageRow(file) {

    const row =
        document.createElement("div");


    row.className =
        "image-row";


    /* ---------------------------------------------
       IMAGE
    --------------------------------------------- */

    const image =
        document.createElement("img");


    image.src =
        file.download_url ||
        (
            "https://raw.githubusercontent.com/" +
            GITHUB_REPOSITORY +
            "/" +
            GITHUB_BRANCH +
            "/" +
            file.path
        );


    image.alt =
        file.name;


    image.loading =
        "lazy";


    image.addEventListener(
        "error",
        function () {

            console.error(
                "IMAGE LOAD ERROR:",
                file.name
            );


            image.style.border =
                "2px solid red";

        }
    );


    /* ---------------------------------------------
       NAME
    --------------------------------------------- */

    const name =
        document.createElement("div");


    name.className =
        "image-name";


    name.textContent =
        file.name;


    /* ---------------------------------------------
       DELETE BUTTON
    --------------------------------------------- */

    const deleteButton =
        document.createElement("button");


    deleteButton.type =
        "button";


    deleteButton.className =
        "delete-button";


    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteImage(
                file.name,
                file.sha
            );

        }
    );


    /* ---------------------------------------------
       ROW
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

    console.group(
        "DELETE IMAGE: " + name
    );


    try {

        const confirmed =
            confirm(
                "Delete " +
                name +
                "?"
            );


        if (!confirmed) {

            return;
        }


        uploadMessage.textContent =
            "Deleting " +
            name +
            "...";


        const url =
            githubFileURL(name);


        /*
         * SHA is required by GitHub when deleting.
         */
        if (!sha) {

            throw new Error(
                "GitHub file SHA is missing. Refresh the image list and try again."
            );
        }


        const response =
            await fetch(
                url,
                {
                    method: "DELETE",

                    headers: {
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


        if (!response.ok) {

            throw await githubError(
                response
            );

        }


        const result =
            await response.json();


        console.log(
            "IMAGE DELETED:",
            result
        );


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
            (
                error?.message ||
                "Unknown error."
            );

    }

    finally {

        console.groupEnd();

    }
}


/* ---------------------------------------------------------
   BUTTONS
--------------------------------------------------------- */

if (uploadButton) {

    uploadButton.addEventListener(
        "click",
        function () {

            uploadImage();

        }
    );

}


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function () {

            loadImages();

        }
    );

}


/* ---------------------------------------------------------
   GLOBAL ERROR HANDLERS
--------------------------------------------------------- */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "GLOBAL BROWSER ERROR:",
            {
                message:
                    event.message,

                filename:
                    event.filename,

                line:
                    event.lineno,

                column:
                    event.colno,

                error:
                    event.error
            }
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "UNHANDLED PROMISE:",
            event.reason
        );

    }
);


/* ---------------------------------------------------------
   STARTUP
--------------------------------------------------------- */

async function startAdmin() {

    console.log(
        "================================================="
    );

    console.log(
        "PRESENT PERFECT ADMIN STARTING"
    );

    console.log(
        "Repository:",
        GITHUB_REPOSITORY
    );

    console.log(
        "Image folder:",
        IMAGE_FOLDER
    );

    console.log(
        "Branch:",
        GITHUB_BRANCH
    );

    console.log(
        "================================================="
    );


    try {

        /*
         * Test authentication FIRST.
         *
         * This makes a 401 much easier to identify.
         */

        if (!tokenConfigured()) {

            throw new Error(
                "Add your NEW GitHub token to GITHUB_TOKEN before using the admin panel."
            );
        }


        await testGitHubAuthentication();


        /*
         * Authentication succeeded.
         * Now load the images.
         */

        await loadImages();

    }

    catch (error) {

        console.error(
            "GITHUB STARTUP FAILED:",
            error
        );


        if (uploadMessage) {

            uploadMessage.textContent =
                "GITHUB ERROR:\n\n" +
                (
                    error?.message ||
                    "Unknown error."
                );

        }


        if (imageList) {

            imageList.textContent =
                "GitHub connection failed.";

        }

    }

}


/* ---------------------------------------------------------
   START
--------------------------------------------------------- */

startAdmin();
