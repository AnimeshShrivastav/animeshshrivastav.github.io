/* =========================================================
   PRESENT PERFECT ADMIN
   GitHub API
========================================================= */


/* ---------------------------------------------------------
   GITHUB CONFIGURATION
--------------------------------------------------------- */

/*
 * IMPORTANT:
 *
 * DO NOT reuse the GitHub token that was previously posted.
 * Revoke that token in GitHub and create a new one.
 *
 * Also note that putting a GitHub token in browser-side
 * JavaScript exposes it to anyone who can access this page.
 */
const GITHUB_TOKEN =
    "5wXqVq4C2eSQ7FV9QomQZHsnuqQRDfTbpfZPimCFdzQYLRWZME5jGbkCWC8";


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
   TOKEN DEBUG
--------------------------------------------------------- */

if (
    GITHUB_TOKEN &&
    GITHUB_TOKEN !==
        "YOUR_GITHUB_TOKEN_HERE"
) {

    console.log(
        "GitHub token loaded:",
        GITHUB_TOKEN.substring(0, 4),
        "length:",
        GITHUB_TOKEN.length
    );

}
else {

    console.warn(
        "GitHub token has not been configured."
    );

}


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

    const url =
        "https://api.github.com/repos/" +
        GITHUB_REPOSITORY +
        "/contents/" +
        IMAGE_FOLDER +
        "/" +
        encodeURIComponent(
            fileName
        );


    console.log(
        "GITHUB FILE URL:",
        url
    );


    return url;
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

            console.warn(
                "No image file selected."
            );

            return;
        }


        console.log(
            "IMAGE SELECTED:",
            {
                name:
                    file.name,

                type:
                    file.type,

                size:
                    file.size,

                lastModified:
                    file.lastModified
            }
        );


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

    console.log(
        "VALIDATING ADMIN INPUT..."
    );


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


    console.log(
        "INPUT VALIDATION PASSED:",
        {
            productName:
                productName,

            price:
                price
        }
    );
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
    const finalName =
        name + ".jpg";


    console.log(
        "NORMALIZED FILENAME:",
        finalName
    );


    return finalName;
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


    const product = {

        name:
            parts[0].trim(),

        price:
            Number(
                parts[1].trim()
            )

    };


    console.log(
        "PRODUCT INFORMATION:",
        product
    );


    return product;
}


/* ---------------------------------------------------------
   RESIZE IMAGE
--------------------------------------------------------- */

async function resizeImage(
    file
) {

    console.log(
        "STARTING IMAGE RESIZE:",
        file.name
    );


    try {

        const bitmap =
            await createImageBitmap(
                file
            );


        console.log(
            "ORIGINAL IMAGE SIZE:",
            {
                width:
                    bitmap.width,

                height:
                    bitmap.height
            }
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
            (resolve, reject) => {

                canvas.toBlob(
                    blob => {

                        if (!blob) {

                            const error =
                                new Error(
                                    "Image resizing failed: canvas.toBlob returned null."
                                );


                            console.error(
                                "IMAGE RESIZE ERROR:",
                                error
                            );


                            reject(
                                error
                            );


                            return;
                        }


                        console.log(
                            "RESIZED IMAGE:",
                            {
                                width:
                                    width,

                                height:
                                    height,

                                size:
                                    blob.size,

                                type:
                                    blob.type
                            }
                        );


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
    catch (error) {

        console.error(
            "IMAGE RESIZE ERROR:",
            {
                file:
                    file.name,

                error:
                    error
            }
        );


        throw error;
    }
}


/* ---------------------------------------------------------
   BLOB TO BASE64
--------------------------------------------------------- */

async function blobToBase64(
    blob
) {

    console.log(
        "CONVERTING BLOB TO BASE64:",
        {
            size:
                blob.size,

            type:
                blob.type
        }
    );


    try {

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


        const base64 =
            btoa(
                binary
            );


        console.log(
            "BASE64 CONVERSION COMPLETE:",
            {
                originalBytes:
                    bytes.length,

                base64Length:
                    base64.length
            }
        );


        return base64;

    }
    catch (error) {

        console.error(
            "BASE64 CONVERSION ERROR:",
            error
        );


        throw error;
    }
}


/* ---------------------------------------------------------
   UPLOAD IMAGE
--------------------------------------------------------- */

async function uploadImage() {

    console.group(
        "UPLOAD IMAGE"
    );


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
            "UPLOAD PRODUCT:",
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


        console.log(
            "UPLOAD API URL:",
            apiURL
        );


        /* ---------------------------------------------
           CHECK EXISTING FILE
        --------------------------------------------- */

        uploadMessage.textContent =
            "Checking GitHub...";


        console.log(
            "CHECKING EXISTING GITHUB FILE..."
        );


        let existingResponse;


        try {

            existingResponse =
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

        }
        catch (networkError) {

            console.error(
                "GITHUB CHECK NETWORK ERROR:",
                {
                    url:
                        apiURL,

                    error:
                        networkError
                }
            );


            throw networkError;
        }


        console.log(
            "GITHUB CHECK RESPONSE:",
            {
                status:
                    existingResponse.status,

                statusText:
                    existingResponse.statusText,

                ok:
                    existingResponse.ok
            }
        );


        let existingSHA =
            null;


        if (
            existingResponse.ok
        ) {

            const existing =
                await existingResponse.json();


            console.log(
                "EXISTING FILE FOUND:",
                existing
            );


            existingSHA =
                existing.sha;

        }
        else if (
            existingResponse.status !== 404
        ) {

            let error;


            try {

                error =
                    await existingResponse.json();

            }
            catch (jsonError) {

                console.error(
                    "GITHUB ERROR JSON PARSE FAILED:",
                    jsonError
                );


                error =
                    {
                        message:
                            "GitHub returned HTTP " +
                            existingResponse.status
                    };
            }


            console.error(
                "GITHUB EXISTING FILE CHECK ERROR:",
                {
                    status:
                        existingResponse.status,

                    statusText:
                        existingResponse.statusText,

                    url:
                        apiURL,

                    response:
                        error
                }
            );


            throw new Error(
                error.message ||
                "Could not check existing image."
            );

        }
        else {

            console.log(
                "FILE DOES NOT EXIST. NEW FILE WILL BE CREATED."
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


        console.log(
            "SENDING IMAGE TO GITHUB:",
            {
                filename:
                    finalFilename,

                branch:
                    GITHUB_BRANCH,

                updating:
                    !!existingSHA,

                base64Length:
                    base64.length
            }
        );


        let uploadResponse;


        try {

            uploadResponse =
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

        }
        catch (networkError) {

            console.error(
                "GITHUB UPLOAD NETWORK ERROR:",
                {
                    url:
                        apiURL,

                    error:
                        networkError
                }
            );


            throw networkError;
        }


        console.log(
            "GITHUB UPLOAD RESPONSE:",
            {
                status:
                    uploadResponse.status,

                statusText:
                    uploadResponse.statusText,

                ok:
                    uploadResponse.ok
            }
        );


        let result;


        try {

            result =
                await uploadResponse.json();

        }
        catch (jsonError) {

            console.error(
                "GITHUB UPLOAD JSON PARSE ERROR:",
                jsonError
            );


            result =
                {};
        }


        if (
            !uploadResponse.ok
        ) {

            console.error(
                "GITHUB UPLOAD ERROR:",
                {
                    status:
                        uploadResponse.status,

                    statusText:
                        uploadResponse.statusText,

                    url:
                        apiURL,

                    response:
                        result
                }
            );


            throw new Error(
                result.message ||
                "GitHub upload failed."
            );
        }


        console.log(
            "GITHUB UPLOAD SUCCESS:",
            result
        );


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
            "================================================="
        );

        console.error(
            "UPLOAD ERROR:"
        );

        console.error(
            error
        );

        console.error(
            "ERROR MESSAGE:",
            error?.message
        );

        console.error(
            "ERROR STACK:",
            error?.stack
        );

        console.error(
            "================================================="
        );


        uploadMessage.textContent =
            "ERROR:\n\n" +
            (
                error?.message ||
                "Unknown error"
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


        console.log(
            "IMAGE FOLDER API URL:",
            url
        );


        let response;


        try {

            response =
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

        }
        catch (networkError) {

            console.error(
                "IMAGE FOLDER NETWORK ERROR:",
                {
                    url:
                        url,

                    error:
                        networkError
                }
            );


            throw networkError;
        }


        console.log(
            "IMAGE FOLDER RESPONSE:",
            {
                status:
                    response.status,

                statusText:
                    response.statusText,

                ok:
                    response.ok,

                url:
                    response.url,

                type:
                    response.type
            }
        );


        if (!response.ok) {

            let error;


            try {

                error =
                    await response.json();

            }
            catch (jsonError) {

                console.error(
                    "FAILED TO PARSE GITHUB ERROR:",
                    jsonError
                );


                error =
                    {
                        message:
                            "GitHub returned HTTP " +
                            response.status
                    };
            }


            console.error(
                "GITHUB IMAGE FOLDER ERROR:",
                {
                    status:
                        response.status,

                    statusText:
                        response.statusText,

                    url:
                        url,

                    response:
                        error
                }
            );


            throw new Error(
                error.message ||
                "Could not read images."
            );
        }


        const files =
            await response.json();


        console.log(
            "GITHUB IMAGE FOLDER DATA:",
            files
        );


        imageList.innerHTML =
            "";


        if (
            !Array.isArray(files)
        ) {

            console.error(
                "GITHUB DID NOT RETURN AN ARRAY:",
                files
            );


            throw new Error(
                "GitHub did not return an image list."
            );
        }


        console.log(
            "TOTAL FILES RETURNED:",
            files.length
        );


        const imageFiles =
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
                );


        console.log(
            "IMAGE FILES FOUND:",
            imageFiles.length
        );


        imageFiles.forEach(
            file => {

                console.log(
                    "ADDING IMAGE:",
                    {
                        name:
                            file.name,

                        path:
                            file.path,

                        sha:
                            file.sha,

                        download_url:
                            file.download_url
                    }
                );


                createImageRow(
                    file
                );

            }
        );


        if (
            imageList.children.length === 0
        ) {

            console.warn(
                "NO IMAGE FILES FOUND IN:",
                IMAGE_FOLDER
            );


            imageList.textContent =
                "No images found.";
        }


        console.log(
            "IMAGE LIST CREATED SUCCESSFULLY."
        );

    }
    catch (error) {

        console.error(
            "================================================="
        );

        console.error(
            "LIST ERROR:"
        );

        console.error(
            error
        );

        console.error(
            "ERROR MESSAGE:",
            error?.message
        );

        console.error(
            "ERROR STACK:",
            error?.stack
        );

        console.error(
            "================================================="
        );


        imageList.textContent =
            "ERROR: " +
            (
                error?.message ||
                "Unknown error"
            );

    }
    finally {

        console.groupEnd();

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
    const imageURL =
        file.download_url;


    console.log(
        "CREATING IMAGE:",
        {
            filename:
                file.name,

            url:
                imageURL,

            path:
                file.path,

            sha:
                file.sha
        }
    );


    image.src =
        imageURL;


    image.alt =
        file.name;


    image.loading =
        "lazy";


    /*
     * IMPORTANT:
     *
     * This catches errors loading the ACTUAL IMAGE.
     *
     * A successful GitHub API request does not mean
     * that the browser was able to load the image.
     */
    image.addEventListener(
        "error",
        function (event) {

            console.error(
                "================================================="
            );

            console.error(
                "IMAGE LOAD ERROR"
            );

            console.error(
                "Filename:",
                file.name
            );

            console.error(
                "Image URL:",
                imageURL
            );

            console.error(
                "GitHub path:",
                file.path
            );

            console.error(
                "GitHub SHA:",
                file.sha
            );

            console.error(
                "Image element:",
                image
            );

            console.error(
                "Event:",
                event
            );

            console.error(
                "Possible causes:",
                [
                    "The download URL is invalid.",
                    "The GitHub file does not exist.",
                    "The image is inaccessible.",
                    "The raw GitHub request failed.",
                    "The browser blocked the request.",
                    "The file is not actually a valid image.",
                    "GitHub/raw.githubusercontent.com returned an error."
                ]
            );

            console.error(
                "================================================="
            );


            /*
             * Optional visual indication.
             */
            image.style.border =
                "2px solid red";


            image.title =
                "Image failed to load: " +
                file.name;

        }
    );


    /*
     * Successful image load.
     */
    image.addEventListener(
        "load",
        function () {

            console.log(
                "IMAGE LOADED SUCCESSFULLY:",
                {
                    filename:
                        file.name,

                    url:
                        imageURL,

                    width:
                        image.naturalWidth,

                    height:
                        image.naturalHeight
                }
            );

        }
    );


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

    console.group(
        "DELETE IMAGE: " +
        name
    );


    const confirmed =
        confirm(
            "Delete " +
            name +
            "?"
        );


    if (!confirmed) {

        console.log(
            "DELETE CANCELLED."
        );


        console.groupEnd();


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


        console.log(
            "DELETE URL:",
            url
        );


        console.log(
            "DELETE SHA:",
            sha
        );


        let response;


        try {

            response =
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

        }
        catch (networkError) {

            console.error(
                "DELETE NETWORK ERROR:",
                {
                    url:
                        url,

                    error:
                        networkError
                }
            );


            throw networkError;
        }


        console.log(
            "DELETE RESPONSE:",
            {
                status:
                    response.status,

                statusText:
                    response.statusText,

                ok:
                    response.ok
            }
        );


        let result;


        try {

            result =
                await response.json();

        }
        catch (jsonError) {

            console.error(
                "DELETE JSON PARSE ERROR:",
                jsonError
            );


            result =
                {};
        }


        if (
            !response.ok
        ) {

            console.error(
                "GITHUB DELETE ERROR:",
                {
                    status:
                        response.status,

                    statusText:
                        response.statusText,

                    url:
                        url,

                    response:
                        result
                }
            );


            throw new Error(
                result.message ||
                "Delete failed."
            );
        }


        console.log(
            "IMAGE DELETED SUCCESSFULLY:",
            result
        );


        uploadMessage.textContent =
            "Deleted:\n" +
            name;


        await loadImages();

    }
    catch (error) {

        console.error(
            "================================================="
        );

        console.error(
            "DELETE ERROR:"
        );

        console.error(
            error
        );

        console.error(
            "ERROR MESSAGE:",
            error?.message
        );

        console.error(
            "ERROR STACK:",
            error?.stack
        );

        console.error(
            "================================================="
        );


        uploadMessage.textContent =
            "DELETE ERROR:\n\n" +
            (
                error?.message ||
                "Unknown error"
            );

    }
    finally {

        console.groupEnd();

    }
}


/* ---------------------------------------------------------
   BUTTONS
--------------------------------------------------------- */

uploadButton.addEventListener(
    "click",
    function () {

        console.log(
            "UPLOAD BUTTON CLICKED."
        );


        uploadImage();

    }
);


refreshButton.addEventListener(
    "click",
    function () {

        console.log(
            "REFRESH BUTTON CLICKED."
        );


        loadImages();

    }
);


/* ---------------------------------------------------------
   GLOBAL UNHANDLED ERROR HANDLER
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


/* ---------------------------------------------------------
   GLOBAL UNHANDLED PROMISE HANDLER
--------------------------------------------------------- */

window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "UNHANDLED PROMISE ERROR:",
            {
                reason:
                    event.reason,

                promise:
                    event.promise
            }
        );

    }
);


/* ---------------------------------------------------------
   START
--------------------------------------------------------- */

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


loadImages();
