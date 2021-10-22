var blackjack = {
  dealerStand: null,
  dealerPoints: null,
  dealerHand: null,
  playerStand: null,
  playerPoints: null,
  playerHand: null,
  hpcon: null,
  deck: [], // The current deck of cards
  dealer: [], // The dealer's current hand
  player: [], // The player's current hand
  dealerCurrentPoints: 0, // The dealer's current points
  playerCurrentPoints: 0, // The player's current points
  safety: 17, // Computer will stand on or past this point
  dstand: false, // Dealer has stood
  pstand: false, // Player has stood
  turn: 0, // by default: 0 for player, 1 for dealer (computer)
  dsymbols: ["&hearts;", "&diams;", "&clubs;", "&spades;"], // HTML symbols for cards
  dnum: { 1: "A", 11: "J", 12: "Q", 13: "K" }, // Card numbers
}
function blackjackGame() {
  /**This method is responsible for evaluating the dealer/player points
   * Ace can be considered as 1 or 11 and face cards are 10 points
   **/
  this.calculatePoints = function () {
    var aces = 0,
      points = 0;
    var result = blackjack.turn ? blackjack.dealer : blackjack.player;
    result.forEach(function (i) {
      if (i.n === 1) {
        aces++;
      } else if (i.n >= 11 && i.n <= 13) {
        points += 10;
      } else {
        points += i.n;
      }
    })
    if (aces != 0) {
      var minmax = [];
      for (var elevens = 0; elevens <= aces; elevens++) {
        var calc = points + (elevens * 11) + (aces - elevens * 1);
        minmax.push(calc);
      }
      points = minmax[0];
      for (var i; i < minmax.length; i++) {
        if (minmax[i] > points && minmax[i] <= 21) {
          points = minmax[i];
        }
      }
    }
    if (blackjack.turn) {
      blackjack.dealerCurrentPoints = points;
    } else {
      blackjack.playerCurrentPoints = points;
      blackjack.playerPoints.innerHTML = points;
    }
  }

  /**This method is responsible for calculating the points and finding the winner 
   * 0 for player to win, 1 for dealer to win, 2 for tie
   **/
  this.check = function () {
    var winner = null,
      message = "";
    if (blackjack.player.length === 2 && blackjack.dealer.length === 2) { //Win on first go
      if (blackjack.playerCurrentPoints === 21 && blackjack.dealerCurrentPoints === 21) {
        winner = 2;
        message = "It's a tie with Blackjacks";
      }
      if (winner === null && blackjack.playerCurrentPoints === 21) {
        winner = 0;
        message = "Player wins with a Blackjack!";
      }
      if (winner === null && blackjack.dealerCurrentPoints === 21) {
        winner = 1;
        message = "Dealer wins with a Blackjack!";
      }
    }
    if (winner === null) { // Win when hit new card
      if (blackjack.playerCurrentPoints > 21) {
        winner = 1;
        message = "Player has gone bust - Dealer wins!";
      }
      if (blackjack.dealerCurrentPoints > 21) {
        winner = 0;
        message = "Dealer has gone bust - Player wins!";
      }
    }
    if (winner === null && blackjack.dstand && blackjack.pstand) { // Win - when both players stand
      // dealer wins
      if (blackjack.dealerCurrentPoints > blackjack.playerCurrentPoints) {
        winner = 1;
        message = "Dealer wins with " + blackjack.dealerCurrentPoints + " points!";
      }
      // Player wins
      else if (blackjack.dealerCurrentPoints < blackjack.playerCurrentPoints) {
        winner = 0;
        message = "Player wins with " + blackjack.playerCurrentPoints + " points!";
      } else {
        winner = 2;
        message = "It's a tie.";
      }
    }
    // Analysis of the winner
    if (winner != null) {
      // show dealer hand and message
      blackjack.dealerPoints.innerHTML = blackjack.dealerCurrentPoints;
      document.getElementById("deal-first").classList.add("show");
      blackjack.hpcon.classList.remove("started");
      alert(message);
    }
    return winner;
  }
  /**This method is responsible for drawing a card from the deck
   * Taking out last card from the deck 
   * Manage dealer/player card
   **/
  this.drawCard = function () {
    var card = blackjack.deck.pop(),
      cardh = document.createElement("div"),
      cardv = (blackjack.dnum[card.n] ? blackjack.dnum[card.n] : card.n) + blackjack.dsymbols[card.s];
    cardh.className = "blackjack-card"; cardh.innerHTML = cardv;
    if (blackjack.turn) {
      if (blackjack.dealer.length === 0) {
        cardh.id = "deal-first";
        cardh.innerHTML = '<div class="back">?</div><div class="front">' + cardv + '</div>';
      }
      blackjack.dealer.push(card);
      blackjack.dealerHand.appendChild(cardh);
    } else {
      blackjack.player.push(card);
      blackjack.playerHand.appendChild(cardh);
    }
  }
  //This method is responsible for dealer move in the game
  this.blackjackDealerMove = function () {
    if (blackjack.turn) {
      if (blackjack.dealerCurrentPoints >= blackjack.safety) {
        stand();//Stand on the safety limit
      } 
      else {
        hitAnotherDraw();
      } //Draw the second card
    }
  }
}
var game = new blackjackGame(); //creating object of constructor function

//This method is responsible for shuffling the deck and initial draw
function startBlackjack() {
  blackjack.deck = [];
  blackjack.dealer = [];
  blackjack.player = [];
  blackjack.dealerCurrentPoints = 0;
  blackjack.playerCurrentPoints = 0;
  blackjack.dstand = false;
  blackjack.pstand = false;
  blackjack.dealerPoints.innerHTML = "?";
  blackjack.playerPoints.innerHTML = 0;
  blackjack.dealerHand.innerHTML = "";
  blackjack.playerHand.innerHTML = "";
  blackjack.dealerStand.classList.remove("stood");
  blackjack.playerStand.classList.remove("stood");
  blackjack.hpcon.classList.add("started");

  //Shuffling the deck
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 14; j++) {
      blackjack.deck.push({s: i,n: j});
    }
  }
  for (var i = blackjack.deck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * i);
    var temp = blackjack.deck[i];
    blackjack.deck[i] = blackjack.deck[j];
    blackjack.deck[j] = temp;
  }
  //Draw initial 4 cards
  blackjack.turn = 0; game.drawCard();
  blackjack.turn = 1; game.drawCard();
  blackjack.turn = 0; game.drawCard();
  blackjack.turn = 1; game.drawCard();

  //Lucky 21 on initial draw
  blackjack.turn = 0; game.calculatePoints();
  blackjack.turn = 1; game.calculatePoints();
  var winner = game.check();
  if (winner === null) {
    blackjack.turn = 0;
  }
}

/**This method is responsible for calculating the points and finding the winner 
 * 0 for player to win, 1 for dealer to win, 2 for tie
 **/
function hitAnotherDraw() {
  game.drawCard(); game.calculatePoints(); //Draw new card 
  //Auto stand on 21 points
  if (blackjack.turn === 0 && blackjack.playerCurrentPoints === 21 && !blackjack.pstand) {
    blackjack.pstand = true;
    blackjack.playerStand.classList.add("stood");
  }
  if (blackjack.turn === 1 && blackjack.dealerCurrentPoints === 21 && !blackjack.dstand) {
    blackjack.dstand = true;
    blackjack.dealerStand.classList.add("stood");
  }
  //continue game if no winner
  var winner = game.check();
  if (winner === null) {
    nextTurn();
  }
}

/**This method is responsible for setting the status
 * Continue playing or not
 **/
function stand() {
  if (blackjack.turn) {
    blackjack.dstand = true; blackjack.dealerStand.classList.add("stood");
  } else {
    blackjack.pstand = true; blackjack.playerStand.classList.add("stood");
  }
  var winner = (blackjack.pstand && blackjack.dstand) ? game.check() : null;
  if (winner === null) nextTurn();
}

/**This method is responsible for giving turn between player and dealer
 * Managing the dealer best move
 **/
function nextTurn() {
  blackjack.turn = blackjack.turn === 0 ? 1 : 0; //Dealer is next
  if (blackjack.turn === 1) {
    if (blackjack.dstand)
      blackjack.turn = 0; //Skip dealer turn when stood
    else 
      game.blackjackDealerMove();
  }
  //Player is next
  else {
    if (blackjack.pstand) {
      blackjack.turn = 1; game.blackjackDealerMove();
    } //Skip player if stood
  }
}

//This method is responsible for initializing the HTML elements of the game
function initializingGame() {
  blackjack.dealerStand = document.getElementById("dealer-stand");
  blackjack.dealerPoints = document.getElementById("dealer-points");
  blackjack.dealerHand = document.getElementById("dealer-cards");
  blackjack.playerStand = document.getElementById("player-stand");
  blackjack.playerPoints = document.getElementById("player-points");
  blackjack.playerHand = document.getElementById("player-cards");
  blackjack.hpcon = document.getElementById("play-control");
  document.getElementById("blackjack-start").addEventListener("click", startBlackjack);
  document.getElementById("blackjack-hit").addEventListener("click", hitAnotherDraw);
  document.getElementById("blackjack-stand").addEventListener("click", stand);
}
window.addEventListener("DOMContentLoaded", initializingGame);