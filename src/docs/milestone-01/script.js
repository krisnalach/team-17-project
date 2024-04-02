'use strict'; 

/**
 * @param {*} pathToFile - relative path to text file, including file itself
 * @param {*} elemId - the ID of the DOM element to render text into, as a string
 * @param {#} callback - function to execute after text has been loaded
 */
function loadText(pathToFile, elemId, callback) {
    fetch(pathToFile)
        .then(response => response.text())
        .then(data => {
            const text = document.createElement('p');
            text.innerHTML = data;
            document.querySelector(elemId).appendChild(text);
            callback(elemId);
        })
        .catch(error => console.error('Error occurred: ', error));
}
/**
 * @param {*} elemId - the ID of the DOM element to read text data from, as a string
 * @returns The word count of the inner text of a DOM element
 */
function getWordCount(elemId) {
    const text = document.querySelector(elemId).innerText.split(/\s+/);
    return text.filter(word => word !== '').length;
}

/**
 * @param {*} elemId - the ID of the DOM element to add a word count button to
 */
function addButton(elemId) {
    let el = document.querySelector(elemId);
    let button = document.createElement('button');
    button.innerText = 'Show Word Count';

    // Add event listener to show word count
    button.addEventListener('click', function(event) {
        // Remove siblings beforehand
        if (button.nextSibling) {
            button.parentNode.removeChild(button.nextSibling);
        }
        // Create new element containing word count and append
        let display = document.createElement('div');
        display.innerHTML = getWordCount(elemId + ' p');
        el.appendChild(display);
    });
    el.appendChild(button);
}

// Load text into DOM elements
loadText('texts/bio_1.txt', '#bio1', console.log);
loadText('texts/filler.txt', '#overview', addButton);
loadText('texts/filler.txt', '#application-parts', addButton);
loadText('texts/filler.txt', '#data-requirements', addButton);
loadText('texts/filler.txt', '#wire-frames', addButton);
loadText('texts/filler.txt', '#real-world', addButton);
loadText('texts/filler.txt', '#integrative-experience', addButton);

