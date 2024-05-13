import * as db from "./db.js";
// code for keeping track of the deck of cards and game state for the blackjack game

// suits, ranks, and values used to create the deck of cards
let suits = ["hearts", "diamonds", "clubs", "spades"];
let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, [1, 11]];

// a heart variable for the player to keep track of how many hearts they have left
let hearts = 5; 
let heart1 = document.getElementById("heart1");
let heart2 = document.getElementById("heart2");
let heart3 = document.getElementById("heart3");
let heart4 = document.getElementById("heart4");
let heart5 = document.getElementById("heart5");

// initialize the deck
let deck = [];

let playerHand = [];
let playerHTML = document.querySelector(".player");
let playerScoreHTML = document.getElementById("player-score");
let playerCard1HTML = document.getElementById("playerCard1");
let playerCard2HTML = document.getElementById("playerCard2");

let dealerHand = [];
let dealerHTML = document.querySelector(".dealer");
let dealerScoreHTML = document.getElementById("dealer-score");
let dealerCard1HTML = document.getElementById("dealerCard1");
let dealerCard2HTML = document.getElementById("dealerCard2");

// we will track the discarded cards and shuffle them back into the deck when the deck runs low
let discardedCards = [];

let scoreHTML = document.getElementById("score");

// this is where we display messages to the player
let middleSpacerHTML = document.getElementById("middleSpacer");

let hitButton = document.getElementById("hit");
let standButton = document.getElementById("stand");
let doubleButton = document.getElementById("double");
let splitButton = document.getElementById("split");

hitButton.addEventListener("click", playerHit);
standButton.addEventListener("click", stand);
doubleButton.addEventListener("click", doubleDown);
splitButton.addEventListener("click", split);

let score = 0;
const username = await db.getUser();

// THIS CODE ACTUALLY STARTS THE GAME
newGame();

// the createDeck function creates and returns a shuffled deck of cards
function createDeck() {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      deck.push({ suit: suits[i], rank: ranks[j], value: values[j] });
    }
  }
  // shuffles the deck
  for (let i = 0; i < deck.length; i++) {
    let randomIndex = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = temp;
  }
  return deck;
}

// the newRound function discards the player and dealer's current hands, gives them new ones, and updates the hand scores
function newRound() {
  middleSpacerHTML.textContent = "";
  discardHands();
  // if the player is out of hearts, end the game
  if (hearts === 0) {
    gameOver();
  }
  else {
    dealInitialHands();
    playerScoreHTML.textContent = calculateHandValue(playerHand);
    dealerScoreHTML.textContent = calculateHandValue(dealerHand);
    // checks if the player has blackjack
    if (calculateHandValue(playerHand) === 21) {
      if (calculateHandValue(dealerHand) === 21) {
        middleSpacerHTML.textContent = "Tie!";
        setTimeout(newRound, 3000);
      }
      else {
        score += 150;
        scoreHTML.textContent = "Score: " + String(score);
        middleSpacerHTML.textContent = "Blackjack! You Win!";
        setTimeout(newRound, 3000);
      }
    }
  }
}  

// the drawCard function returns the top card from the deck
function drawCard() {
  // if deck is less than 8 cards, shuffles the discarded cards back into the deck
  if (deck.length < 8) {
    deck = deck.concat(discardedCards);
    discardedCards = [];
    for (let i = 0; i < deck.length; i++) {
      let randomIndex = Math.floor(Math.random() * deck.length);
      let temp = deck[i];
      deck[i] = deck[randomIndex];
      deck[randomIndex] = temp;
    }
  }
  return deck.pop();
}

// the dealInitialHands function deals two cards to the player and two cards to the dealer
function dealInitialHands() {
  let playerCard1 = drawCard();
  playerHand.push(playerCard1);
  playerCard1HTML.textContent = playerCard1.rank;
  let playerCard2 = drawCard();
  playerHand.push(playerCard2);
  playerCard2HTML.textContent = playerCard2.rank;
  let dealerCard1 = drawCard();
  dealerHand.push(dealerCard1);
  dealerCard1HTML.textContent = dealerCard1.rank;
  let dealerCard2 = drawCard();
  dealerHand.push(dealerCard2);
  dealerCard2HTML.textContent = dealerCard2.rank;
}

// the discardHands function moves the cards in the player and dealer hands to the discarded cards pile
function discardHands() {
  discardedCards = discardedCards.concat(playerHand, dealerHand);
  // these while loops remove all the additional cards from the player and dealer, leaving us with the original 2
  while (playerHTML.lastChild.id !== "playerCard1" && playerHTML.lastChild.id !== "playerCard2") {
    playerHTML.removeChild(playerHTML.lastChild);
  }
  while (dealerHTML.lastChild.id !== "dealerCard1" && dealerHTML.lastChild.id !== "dealerCard2") {
    dealerHTML.removeChild(dealerHTML.lastChild);
  }
  playerHand = [];
  dealerHand = [];
}

// the playerHit function adds a card to the player's hand
function playerHit() {
  let card_drawn = drawCard();
  playerHand.push(card_drawn);
  let card = document.createElement("div");
  card.classList.add("card");
  card.textContent = card_drawn.rank;
  playerHTML.appendChild(card);
  playerScoreHTML.textContent = calculateHandValue(playerHand);
  if (calculateHandValue(playerHand) === 21) {
    if (calculateHandValue(dealerHand) === 21) {
      middleSpacerHTML.textContent = "Tie!";
      setTimeout(newRound, 3000);
    }
    else {
      winRound();
    }
  }
  // checks if the player has busted
  if (calculateHandValue(playerHand) > 21) {
    bustPlayer()
  }
}

// the doubleDown function doubles the player's hearts risked and adds one card to the player's hand
function doubleDown() {
  let card_drawn = drawCard();
  playerHand.push(card_drawn);
  let card = document.createElement("div");
  card.classList.add("card");
  card.textContent = card_drawn.rank;
  playerHTML.appendChild(card);
  playerScoreHTML.textContent = calculateHandValue(playerHand);
  if (calculateHandValue(playerHand) > 21) {
    loseHeart(); // lose the additional heart
    bustPlayer() // bust like normal and lose the other heart
  }
  else {
    doubleStand();
  }
}

// the doubleStand function works like the stand function, but with double hearts lost or double score gained
function doubleStand() {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHit();
  }
  if (calculateHandValue(dealerHand) > 21) {
    score += 100; // extra 100 points for double down
    bustDealer();
  }
  else if (calculateHandValue(playerHand) > calculateHandValue(dealerHand)) {
    score += 200; 
    scoreHTML.textContent = "Score: " + String(score);
    middleSpacerHTML.textContent = "You Win! Double Points!";
    setTimeout(newRound, 3000);
  } else if (calculateHandValue(playerHand) < calculateHandValue(dealerHand)) {
    loseHeart();
    loseHeart();
    middleSpacerHTML.textContent = "You Lose! Two Hearts Lost :(";
    setTimeout(newRound, 3000);
  } else {
    newRound();
  }
}

// the dealerHit function adds a card to the dealer's hand
function dealerHit() {
  let card_drawn = drawCard();
  dealerHand.push(card_drawn);
  let card = document.createElement("div");
  card.classList.add("card");
  card.textContent = card_drawn.rank;
  dealerHTML.appendChild(card);
  dealerScoreHTML.textContent = calculateHandValue(dealerHand);
}

// TODO the split function allows the player to split their hand into two hands
function split() {
  // check if the player has two cards of the same rank
  // if they do, split the hand into two hands
  return false;
}

// the stand function runs the dealer's turn and then determines the winner
function stand() {
  // dealer hits until their hand value is 17 or greater
  while (calculateHandValue(dealerHand) < 17) {
    dealerHit();
  }
  if (calculateHandValue(dealerHand) > 21) {
    bustDealer();
  }
  else if (calculateHandValue(playerHand) > calculateHandValue(dealerHand)) {
    winRound();
  } else if (calculateHandValue(playerHand) < calculateHandValue(dealerHand)) {
    loseHeart();
    loseRound();
  } else {
    middleSpacerHTML.textContent = "Tie!";
    setTimeout(newRound, 3000);
  }
}

// the loseHeart function removes a heart from the counter and updates the UI
function loseHeart() {
  if (hearts === 5) {
    heart5.src = "images/PHeart-Empty.png";
  }
  else if (hearts === 4) {
    heart4.src = "images/PHeart-Empty.png";
  }
  else if (hearts === 3) {
    heart3.src = "images/PHeart-Empty.png";
  }
  else if (hearts === 2) {
    heart2.src = "images/PHeart-Empty.png";
  }
  else if (hearts === 1) {
    heart1.src = "images/PHeart-Empty.png";
  }
  else if(hearts === 0){
    gameOver();
  }
  hearts -= 1;
}

// the bustPlayer function has the player lose the round and lose a heart
function bustPlayer() {
  scoreHTML.textContent = "Score: " + String(score);
  middleSpacerHTML.textContent = "You Busted! You Lose!";
  loseHeart();
  setTimeout(newRound, 3000);
}

// the bustDealer function has the dealer lose the round and the player win
function bustDealer() {
  score += 100;
  scoreHTML.textContent = "Score: " + String(score);
  middleSpacerHTML.textContent = "Dealer Busted! You Win!";
  setTimeout(newRound, 3000);
}

// the winRound function has the player win the round and gain 100 points
function winRound() {
  score += 100;
  scoreHTML.textContent = "Score: " + String(score);
  middleSpacerHTML.textContent = "You Win!";
  setTimeout(newRound, 3000);
}

// the loseRound function has the player lose the round
function loseRound() {
  middleSpacerHTML.textContent = "You Lose!";
  setTimeout(newRound, 3000);
}

// the calculateHandValue function calculates the value of a hand of cards
function calculateHandValue (hand) {
  let value = 0;
  let aces = 0;
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].rank === "A") {
      aces += 1;
      value += 11;
    }
    else {
      value += hand[i].value;
    }
  }
  // in blackjack, aces are worth either 1 or 11
  // if the hand is greater than 21 due to an ace being worth 11, change the value of the ace to 1
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }
  return value;
}

// the gameOver function displays a screen to the player with their final score and a button to start a new game
function gameOver() {
  middleSpacerHTML.textContent = "Game Over! Final Score: " + String(score);
  let newGameButton = document.createElement("button");
  newGameButton.textContent = "New Game";
  newGameButton.addEventListener("click", newGame);
  middleSpacerHTML.appendChild(newGameButton);
  // TODO save the score to the server
  // deciding to go with .then() approach since most functions here are not async
  if (username !== -1) { // only update leaderboard if user is logged in
    fetch('/updateLeaderboard', {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, score}),
      credentials: "include",
    })
    .then(response => {
      // dont need to do anything
      console.log("leaderboard successfully updated");
    })
    .catch(err => {
      console.error(err);
    });
  }
  
  
}

// the newGame function resets the game state
function newGame() {
  deck = createDeck();
  // reset hearts
  hearts = 5;
  heart1.src = "images/PHeart.png";
  heart2.src = "images/PHeart.png";
  heart3.src = "images/PHeart.png";
  heart4.src = "images/PHeart.png";
  heart5.src = "images/PHeart.png";
  // reset score
  score = 0;
  newRound();
}