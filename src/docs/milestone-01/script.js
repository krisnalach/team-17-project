'use strict'; 

/**
 * 
 * @param {*} pathToFile - relative path to text file, including file itself
 * @param {*} elemId - the ID of the DOM element to render text into
 */
function loadText(pathToFile, elemId) {
    fetch(pathToFile)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elemId).innerText = data;
        })
        .catch(error => console.error('Error occurred: ', error));
}

loadText('texts/bio_1.txt', 'bio1');