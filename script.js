const OWNER = "AnimeshShrivastav";

const REPOSITORY = "animeshshrivastav.github.io";

const BRANCH = "main";

const IMAGE_FOLDER = "images";


const API_URL =
    `https://api.github.com/repos/${OWNER}/${REPOSITORY}/contents/${IMAGE_FOLDER}?ref=${BRANCH}`;


const productsContainer =
    document.getElementById("products");

const status =
    document.getElementById("status");


async function loadImages() {

    try {

        status.textContent =
            "Reading images folder from GitHub...";


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `GitHub returned HTTP ${response.status}`
            );
        }


        const files =
            await response.json();


        if (!Array.isArray(files)) {

            throw new Error(
                "GitHub did not return a folder listing."
            );
        }


        const images =
            files.filter(file => {

                if (file.type !== "file") {
                    return false;
                }

                const name =
                    file.name.toLowerCase();

                return (
                    name.endsWith(".jpg") ||
                    name.endsWith(".jpeg") ||
                    name.endsWith(".png") ||
                    name.endsWith(".webp")
                );
            });


        if (images.length === 0) {

            status.textContent =
                "No image files found.";

            return;
        }


        status.textContent =
            `${images.length} image(s) found`;


        images.forEach(file => {

            createProduct(file);

        });


    } catch (error) {

        console.error(
            "GitHub image loading error:",
            error
        );


        status.textContent =
            "Could not load images.";

        const message =
            document.createElement("p");

        message.textContent =
            error.message;

        productsContainer.appendChild(
            message
        );
    }
}


function createProduct(file) {

    const product =
        document.createElement("div");

    product.className =
        "product";


    const image =
        document.createElement("img");


    /*
       GitHub's download_url is the actual
       image URL.
    */

    image.src =
        file.download_url;


    image.alt =
        file.name;


    image.loading =
        "lazy";


    image.onerror =
        function () {

            console.error(
                "Image failed:",
                file.name
            );

        };


    const title =
        document.createElement("h3");


    /*
       Remove extension from filename.
    */

    title.textContent =
        file.name.replace(
            /\.[^/.]+$/,
            ""
        );


    product.appendChild(image);

    product.appendChild(title);


    productsContainer.appendChild(
        product
    );
}


loadImages();
