let allImages = [];

// selecting elements from html
const imageGallery = document.querySelector('#img-gallery');
const loaderCont = document.querySelector('#loader-cont');
const loader = document.querySelector('#loader');
const scrollLoader = document.querySelector('#scroll-Loader');


let imagesReady = false;
let imagesLoad = 0;
let totalImages = 0;

// Unsplash API
let imagesWillLoad = 12;
const apiKey = 'O8zd6Rf_1cIsLoMFdMryHjLPd4rxz-tUW2qeCqhpVGo';
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imagesWillLoad}`;


// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
    const keys = Object.keys(attributes);
    for (const key of keys) {
      element.setAttribute(key, attributes[key]);
    }
}


// show the loader
let showLoaderFunctionCount = 1;
const showLoader = () => {
    if (showLoaderFunctionCount > 1) {
        return;
    } else {
        loaderCont.classList.remove('invisible');
        showLoaderFunctionCount++;
    }
}

// hide the loader
let hideLoaderFunctionCount = 1;
const hideLoader = () => {
    if (hideLoaderFunctionCount > 1) {
        return;
    } else {
        loaderCont.classList.add('invisible');
        hideLoaderFunctionCount++;
    }
}

// checks that the images has load or not
const imageLoaded = () => {
    imagesLoad++;
    if (totalImages === imagesLoad) {
        imagesReady = true;
        imagesWillLoad = 20;
        apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imagesWillLoad}`;
        // hide the loader
        hideLoader();
    } else {
        scrollLoader.hidden = false;
    }
}

// displays images
const displayImages = (images) => {
    imagesLoad = 0;
    totalImages = allImages.length;
    images.forEach(image => {
        // create a anchor tag
        const a = document.createElement('a');
        setAttributes(a, { href : image.links.html });

        // create a img tag
        const img = document.createElement('img');

        if (img.title === null) {
            img.title = 'description not known';
        } 
        img.title = image.alt_description;
        setAttributes(img, { src : image.urls.regular });

        // when the image will load
        img.addEventListener('load', imageLoaded);

        // appending the image into image gallery
        a.appendChild(img);    
        imageGallery.appendChild(a);

    });
}

// getting images from api
const getImages = async () => {
    showLoader();
    try {
        const response = await axios.get(apiUrl);
        allImages = response.data;
        console.log(allImages);
        displayImages(allImages);
    } catch (error) {
        console.log(error);
    }
}

// checking if the user has reached to the bottom of the page
const isInBottom = (count) => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - count) {
        return true;
    } 
    return false;
}

// on load
getImages();

window.addEventListener('scroll', () => {
    if (isInBottom(2000) && imagesReady) {
        imagesReady = false;
        getImages();
    }
})

