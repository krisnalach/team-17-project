// code for keeping track of a deck of cards in the context of a game blackjack
// track the deck of cards, shuffle the deck, draw a card, and keep track of the cards that have been drawn
// track the player and the dealer's hands
// track the cards discarded after a round

// make a deck of standard playing cards
// 4 suits: hearts, diamonds, clubs, spades
// 13 ranks: 2-10, J, Q, K, A
// 52 cards total

let suits = ["hearts", "diamonds", "clubs", "spades"];
let ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, [1, 11]];

let hearts = 5; 
let heart1 = document.getElementById("heart1");
let heart2 = document.getElementById("heart2");
let heart3 = document.getElementById("heart3");
let heart4 = document.getElementById("heart4");
let heart5 = document.getElementById("heart5");

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

let discardedCards = [];
let scoreHTML = document.getElementById("score");

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

// THIS CODE ACTUALLY STARTS THE GAME
deck = createDeck();
newRound();


// the createDeck function creates and returns a shuffled deck of cards
function createDeck() {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      deck.push({ suit: suits[i], rank: ranks[j], value: values[j] });
    }
  }
  // shuffle the deck
  for (let i = 0; i < deck.length; i++) {
    let randomIndex = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = temp;
  }
  return deck;
}

function newRound() {
  middleSpacerHTML.textContent = "";
  // discard previous hands
  discardHands();
  // deal initial hands
  dealInitialHands();
  // update player score
  playerScoreHTML.textContent = calculateHandValue(playerHand);
  // update dealer score
  dealerScoreHTML.textContent = calculateHandValue(dealerHand);
  // if the player has blackjack, they win
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

// the drawCard function returns the top card from the deck
function drawCard() {
  // if deck is less than 8 cards, shuffle the discarded cards back into the deck
  if (deck.length < 8) {
    deck = deck.concat(discardedCards);
    discardedCards = [];
    // shuffle the deck
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
  // remove elements from the player and dealer hands not named playerCard1 or playerCard2 or dealerCard1 or dealerCard2
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
  // update player score
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
  // check if the player has busted
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

// stand function that runs the dealer's turn and then determines the winner
function stand() {
  // dealer hits until their hand value is 17 or greater
  while (calculateHandValue(dealerHand) < 17) {
    dealerHit();
  }
  if (calculateHandValue(dealerHand) > 21) {
    bustDealer();
  }
  // determine the winner
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
    gameOver();
  }
  hearts -= 1;
}

function bustPlayer() {
  scoreHTML.textContent = "Score: " + String(score);
  middleSpacerHTML.textContent = "You Busted! You Lose!";
  loseHeart();
  setTimeout(newRound, 3000);
}

function bustDealer() {
  score += 100;
  scoreHTML.textContent = "Score: " + String(score);
  middleSpacerHTML.textContent = "Dealer Busted! You Win!";
  setTimeout(newRound, 3000);
}

function winRound() {
  score += 100;
  scoreHTML.textContent = "Score: " + String(score);
  middleSpacerHTML.textContent = "You Win!";
  setTimeout(newRound, 3000);
}

function loseRound() {
  middleSpacerHTML.textContent = "You Lose!";
  setTimeout(newRound, 3000);
}

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
  // if the hand is greater than 21 due to an ace being worth 11, change the value of the ace to 1
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }
  return value;
}

function gameOver() {
  // TODO
}