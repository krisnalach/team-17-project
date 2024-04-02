'use strict'; 

/**
 * Find an element by tag, grab a text file, add text from that file
 * into the element as a <p> child. Callback function is for adding buttons
 * to read info about <p>, as DOM elements are loaded before the fetch request
 * is finished
 * 
 * @param {*} pathToFile - relative path to text file, including file itself
 * @param {*} elemId - the ID of the DOM element to render text into, as a string
 * @param {#} callback - function to execute after text has been loaded
 */
function loadText(pathToFile, elemId, callback) {
    fetch(pathToFile)
        .then(response => response.text())
        .then(data => {
            const text = document.createElement('p');
            text.textContent = data;
            text.style.whiteSpace = 'pre-wrap';
            document.querySelector(elemId).appendChild(text);
            callback(elemId);
        })
        .catch(error => console.error('Error occurred: ', error));
}
/**
 * Grab an element by its tag and read the text inside of it to get word counts
 * 
 * @param {*} elemId - the ID of the DOM element to read text data from, as a string
 * @returns The word count of the inner text of a DOM element
 */
function getWordCount(elemId) {
    const text = document.querySelector(elemId).innerText.split(/\s+/);
    return text.filter(word => word !== '').length;
}

/**
 * Add a button to an element by its tag, with the purpose of displaying
 * word count. Future work -> passing in any event (?)
 * 
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

// Load group information into DOM elements
loadText('texts/filler.txt', '#lach-role', console.log);
loadText('texts/lach-bio.txt', '#lach-bio', console.log);
loadText('texts/filler.txt', '#lustgarten-role', console.log);
loadText('texts/lustgarten-bio.txt', '#lustgarten-bio', console.log);
loadText('texts/filler.txt', '#lee-role', console.log);
loadText('texts/filler.txt', '#lee-bio', console.log);
loadText('texts/filler.txt', '#li-role', console.log);
loadText('texts/filler.txt', '#li-bio', console.log);

// Load writing segments into DOM elements
loadText('texts/filler.txt', '#overview', addButton);
loadText('texts/filler.txt', '#application-parts', addButton);
loadText('texts/filler.txt', '#data-requirements', addButton);
loadText('texts/filler.txt', '#wire-frames', addButton);
loadText('texts/real-world.txt', '#real-world', addButton);
loadText('texts/filler.txt', '#integrative-experience', addButton);

