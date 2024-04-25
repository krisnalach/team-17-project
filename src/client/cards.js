// code for keeping track of a deck of cards in the context of a game blackjack
// track the deck of cards, shuffle the deck, draw a card, and keep track of the cards that have been drawn
// track the player and the dealer's hands
// track the cards discarded after a round

// make a deck of standard playing cards
// 4 suits: hearts, diamonds, clubs, spades
// 13 ranks: 2-10, J, Q, K, A
// 52 cards total

var suits = ["hearts", "diamonds", "clubs", "spades"];
var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, [1, 11]];

var deck = [];
var playerHand = [];
var dealerHand = [];
var discardedCards = [];

// the createDeck function creates and returns a shuffled deck of cards
function createDeck() {
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < ranks.length; j++) {
      deck.push({ suit: suits[i], rank: ranks[j], value: values[j] });
    }
  }
  // shuffle the deck
  for (var i = 0; i < deck.length; i++) {
    var randomIndex = Math.floor(Math.random() * deck.length);
    var temp = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = temp;
  }
  return deck;
}

// the drawCard function returns the top card from the deck
function drawCard(deck) {
  return deck.pop();
}

// the dealInitialHands function deals two cards to the player and two cards to the dealer
function dealInitialHands() {
  playerHand.push(drawCard(deck));
  playerHand.push(drawCard(deck));
  dealerHand.push(drawCard(deck));
  dealerHand.push(drawCard(deck));
}

// the discardHands function moves the cards in the player and dealer hands to the discarded cards pile
function discardHands() {
  discardedCards = discardedCards.concat(playerHand, dealerHand);
  playerHand = [];
  dealerHand = [];
}

// the playerHit function adds a card to the player's hand
function playerHit() {
  playerHand.push(drawCard(deck));
}

// TODO the doubleDown function doubles the player's hearts risked and adds one card to the player's hand
function doubleDown() {
  // double the player's hearts risked
  playerHand.push(drawCard(deck));
  // make player stand
}

// the dealerHit function adds a card to the dealer's hand
function dealerHit() {
  dealerHand.push(drawCard(deck));
}

// TODO the split function allows the player to split their hand into two hands
function split() {
  // check if the player has two cards of the same rank
  // if they do, split the hand into two hands
  return false;
}
