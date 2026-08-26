/* =========================================================
   PRESENT PERFECT ADMIN
   GitHub API
========================================================= */


/* ---------------------------------------------------------
   DOM
--------------------------------------------------------- */

const repository =
    document.getElementById(
        "repository"
    );


const githubToken =
    document.getElementById(
        "githubToken"
    );


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


        preview.src =
            URL.createObjectURL(
                file
            );


        preview.hidden =
            false;


        if (
            !filename.value
        ) {

            filename.value =
                file.name
                    .replace(
                        /\s+/g,
                        "_"
                    );
        }

    }
);


/* ---------------------------------------------------------
   GITHUB HEADERS
--------------------------------------------------------- */

function githubHeaders() {

    return {

        "Authorization":
            "Bearer " +
            githubToken.value.trim(),

        "Accept":
            "application/vnd.github+json",

        "X-GitHub-Api-Version":
            "2022-11-28"

    };
}


/* ---------------------------------------------------------
   CHECK INPUT
--------------------------------------------------------- */

function validateAdminInput() {

    if (
        !repository.value.trim()
    ) {

        throw new Error(
            "Repository is required."
        );
    }


    if (
        !githubToken.value.trim()
    ) {

        throw new Error(
            "GitHub token is required."
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
            "Filename is required."
        );
    }
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


    let binary = "";


    const chunkSize =
        0x8000;


    for (
        let i = 0;
        i < bytes.length;
        i += chunkSize
    ) {

        binary += String.fromCharCode(
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
   NORMALIZE FILENAME
--------------------------------------------------------- */

function normalizeFilename(
    name
) {

    name =
        name.trim();


    name =
        name.replace(
            /\s+/g,
            "_"
        );


    name =
        name.replace(
            /\.(png|webp|jpeg)$/i,
            ".jpg"
        );


    if (
        !/\.jpg$/i.test(
            name
        )
    ) {

        name +=
            ".jpg";
    }


    return name;
}


/* ---------------------------------------------------------
   UPLOAD
--------------------------------------------------------- */

async function uploadImage() {

    try {

        validateAdminInput();


        uploadMessage.textContent =
            "Preparing image...";


        const file =
            imageFile.files[0];


        const finalFilename =
            normalizeFilename(
                filename.value
            );


        const resizedBlob =
            await resizeImage(
                file
            );


        if (!resizedBlob) {

            throw new Error(
                "Image resizing failed."
            );
        }


        uploadMessage.textContent =
            "Converting image...";


        const base64 =
            await blobToBase64(
                resizedBlob
            );


        const repo =
            repository.value.trim();


        const apiURL =
            "https://api.github.com/repos/" +
            repo +
            "/contents/images/" +
            encodeURIComponent(
                finalFilename
            );


        /* -------------------------------------------------
           CHECK WHETHER FILE ALREADY EXISTS
        ------------------------------------------------- */

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


        /* -------------------------------------------------
           UPLOAD
        ------------------------------------------------- */

        uploadMessage.textContent =
            existingSHA
                ? "Updating image..."
                : "Uploading image...";


        const body = {

            message:
                existingSHA
                    ? "Update product image " +
                      finalFilename
                    : "Add product image " +
                      finalFilename,

            content:
                base64

        };


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


        uploadMessage.textContent =
            "SUCCESS\n\n" +
            finalFilename +
            "\n\n" +
            "GitHub has accepted the image.";


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
   LIST IMAGES
--------------------------------------------------------- */

async function loadImages() {

    imageList.innerHTML =
        "Loading...";


    try {

        if (
            !repository.value.trim()
        ) {

            throw new Error(
                "Repository is required."
            );
        }


        const url =
            "https://api.github.com/repos/" +
            repository.value.trim() +
            "/contents/images?t=" +
            Date.now();


        const response =
            await fetch(
                url,
                {

                    headers:
                        githubToken.value.trim()
                            ? githubHeaders()
                            : {},

                    cache:
                        "no-store"
                }
            );


        if (
            !response.ok
        ) {

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


        files
            .filter(
                file =>
                    file.type ===
                    "file"
            )
            .forEach(
                file => {

                    createImageRow(
                        file
                    );
                }
            );


        if (
            imageList.children.length ===
            0
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
   IMAGE ROW
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


    const image =
        document.createElement(
            "img"
        );


    image.src =
        "images/" +
        encodeURIComponent(
            file.name
        );


    image.alt =
        file.name;


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "image-name";


    name.textContent =
        file.name;


    const deleteButton =
        document.createElement(
            "button"
        );


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
   DELETE
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


    if (
        !confirmed
    ) {

        return;
    }


    try {

        const url =
            "https://api.github.com/repos/" +
            repository.value.trim() +
            "/contents/images/" +
            encodeURIComponent(
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
                                "Delete " +
                                name,

                            sha:
                                sha

                        })
                }
            );


        const result =
            await response.json();


        if (
            !response.ok
        ) {

            throw new Error(
                result.message ||
                "Delete failed."
            );
        }


        uploadMessage.textContent =
            "Deleted: " +
            name;


        await loadImages();

    }
    catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        uploadMessage.textContent =
            "DELETE ERROR:\n" +
            error.message;
    }
}


/* ---------------------------------------------------------
   BUTTONS
--------------------------------------------------------- */

uploadButton.onclick =
    uploadImage;


refreshButton.onclick =
    loadImages;
