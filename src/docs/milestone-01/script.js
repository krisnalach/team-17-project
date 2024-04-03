"use strict";

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
function loadText(pathToFile, elemId, callback = () => {}) {
  fetch(pathToFile)
    .then((response) => response.text())
    .then((data) => {
      const text = document.createElement("p");
      text.textContent = data;
      text.style.whiteSpace = "pre-wrap";
      document.querySelector(elemId).appendChild(text);
      callback(elemId);
    })
    .catch((error) => console.error("Error occurred: ", error));
}
/**
 * Determine the word count of an element's inner text property
 *
 * @param {*} elem - the element itself
 * @returns The word count of the inner text of a DOM element
 */
function getWordCount(elem) {
  const text = elem.innerText.split(/\s+/);
  return text.filter((word) => word !== "").length;
}

/**
 * Add a button to an element by its tag, with the purpose of displaying
 * word count. Future work -> passing in any event (?)
 *
 * @param {*} elemId - the ID of the DOM element to add a word count button to
 */
function addButton(elemId) {
  let el = document.querySelector(elemId);
  let button = document.createElement("button");
  button.innerText = "Show Word Count";

  // Add event listener to show word count
  button.addEventListener("click", function (event) {
    // Remove next sibling beforehand to avoid multiple word count displays
    if (button.nextSibling) {
      button.parentNode.removeChild(button.nextSibling);
    }
    // Create new element containing word count and append
    let display = document.createElement("div");
    let count = 0;
    // Get word count for all child 'p' elements
    for (let child of el.children) {
      if (child.tagName.toLowerCase() === "p") {
        count += getWordCount(child);
      }
    }
    display.innerHTML = count;
    el.appendChild(display);
  });
  el.appendChild(button);
}

// Load group information into DOM elements
loadText("texts/filler.txt", "#lach-role");
loadText("texts/lach-bio.txt", "#lach-bio");
loadText("texts/lustgarten-bio.txt", "#lustgarten-bio");
loadText("texts/filler.txt", "#lee-role");
loadText("texts/filler.txt", "#lee-bio");
loadText("texts/li-bio.txt", "#li-role");
loadText("texts/filler.txt", "#li-bio");

// Load writing segments into DOM elements
loadText('texts/overview.txt', '#overview', addButton);
loadText('texts/application-parts.txt', '#application-parts', addButton);
loadText('texts/data-reqs.txt', '#data-requirements', addButton);
loadText('texts/filler.txt', '#wire-frames');
loadText('texts/filler.txt', '#wire-frames', addButton);
loadText('texts/real-world.txt', '#real-world', addButton);
loadText('texts/integrative-experience.txt', '#integrative-experience', addButton);

