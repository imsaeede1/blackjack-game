const app = (function () {
  const game = {};
  const suits = ["spades", "hearts", "clubs", "diams"];
  const ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  const score = [0, 0];

  function init() {
    game.cash = 100;
    game.bet = 0;
    buildGameBoard();
    turnOff(game.btnHit);
    turnOff(game.btnStand);
    turnOff(game.btnSplit);
    turnOff(game.btnDouble);
    buildDeck();
    addClicker();
    // scoreBoard();
    updateCash();
    deal();
  }

  function updateCash() {
    if (isNaN(game.inputBet.value) || game.inputBet.value.length < 1) {
      game.inputBet.value = 0;
    }
    if (game.inputBet.value > game.cash) {
      game.inputBet.value = game.cash;
    }
    game.bet = Number(game.inputBet.value);
    game.playerCash.textContent = "Player Cash $" + (game.cash - game.bet);
  }

  function lockWager(tog) {
    game.inputBet.disabled = tog;
    game.betButton.disabled = tog;
    if (tog) {
      game.betButton.style.backgroundColor = "#ddd";
      game.inputBet.style.backgroundColor = "#ddd";
    } else {
      game.betButton.style.backgroundColor = "#000";
      game.betButton.style.color = "#fff";
      game.inputBet.style.backgroundColor = "#fff";
    }
  }

  function setBet() {
    // game.status.textContent = "You bet $" + game.bet;
    game.cash = game.cash - game.bet;
    game.playerCash.textContent = "player Cash $" + game.cash;
    lockWager(true);
  }

  // function scoreBoard() {
  //   game.scoreboard.textContent = `Dealer ${score[0]} vs Player ${score[1]}`;
  // }

  function addClicker() {
    game.btnDeal.addEventListener("click", deal);
    game.btnStand.addEventListener("click", playerStand);
    game.btnHit.addEventListener("click", nextCard);
    game.betButton.addEventListener("click", setBet);
    game.inputBet.addEventListener("change", updateCash);
  }

  function deal() {
    game.dealerHand = [];
    game.playerHand = [];
    const childElement = game.playerScore;
    childElement.style.display="none";
    childElement.style.backgroundColor = "gray";
    childElement.style.color = "#fff";
    game.start = true;
    lockWager(true);
    turnOff(game.btnDeal);
    game.playerCards.innerHTML = "";
    game.dealerCards.innerHTML = "";
    const cards = [
      [game.dealerHand, game.dealerCards, true],
      [game.dealerHand, game.dealerCards, false],
      [game.playerHand, game.playerCards, false],
      [game.playerHand, game.playerCards, false],
    ];
    cards.forEach((card, index) => {
     takeCard(card[0], card[1], card[2], index);
  });
  setTimeout(() => {
    childElement.style.display="block"
    showResult();
}, 2000);  
    // takeCard(game.dealerHand, game.dealerCards, true);
    // takeCard(game.dealerHand, game.dealerCards, false);
    // takeCard(game.playerHand, game.playerCards, false);
    // takeCard(game.playerHand, game.playerCards, false);
    setTimeout(() => {
      updateCount();
  }, 700); 
    let dealerScor = game.dealerHand[1].value;
    game.dealerScore.textContent = dealerScor;
  }

  function playerStand() {
    dealerPlay();
    turnOff(game.btnHit);
    turnOff(game.btnStand);
  }

  function nextCard() {
    takeCard(game.playerHand, game.playerCards, false);
    setTimeout(() => {
      updateCount();
  }, 700); 
  }

  function findWinner() {
    let player = scorer(game.playerHand);
    let dealer = scorer(game.dealerHand);
    if (player > 21) {
      // game.status.textContent = "You Busted with " + player + "";

      game.dealerScore.textContent = dealer;
      game.cardBack.style.display = "none";
      setTimeout(() => {
        game.dealerCards
          .querySelector(".card")
          .querySelector(".thecard").style.transform = "rotateY(180deg)";
        game.dealerCards
          .querySelector(".card")
          .querySelector(".thecard").style.transition = "transform 0.1s";
      }, 100);
    }
    if (dealer > 21) {
      // game.status.textContent = "Dealer Busted with " + dealer + "";
    }
    if (player == dealer) {
      // game.status.textContent = "Draw no winners " + player + "";
      game.cash = game.cash + game.bet;
      const childElement = game.playerScore;
      childElement.style.backgroundColor = "#ff774a";
      childElement.style.color = "#000";
      let children =
        childElement.previousElementSibling.querySelectorAll(".card");
      children.forEach((child) => {
        child.classList.add("tied");
      });
    } else if ((player < 22 && player > dealer) || dealer > 21) {
      // game.status.textContent = "You Win with " + player + "";
      const childElement = game.playerScore;
      childElement.style.backgroundColor = "#3dd179";
      childElement.style.color = "#000";
      let children =
        childElement.previousElementSibling.querySelectorAll(".card");
      children.forEach((child) => {
        child.classList.add("win");
      });

      game.cash = game.cash + game.bet * 2;
      score[1]++;
    } else {
      // game.status.textContent += "Dealer wins with" + dealer + "";
      score[0]++;
      const childElement = game.playerScore;
      let children =
      childElement.previousElementSibling.querySelectorAll(".card");
      children.forEach((child) => {
        child.classList.add("lose");
      });
      childElement.style.backgroundColor = "#f1323e";
      childElement.style.color = "#000";
    }
    if (game.cash < 1) {
      game.cash = 0;
      game.bet = 0;
    }
    // scoreBoard();
    game.playerCash.textContent = "Player Cash $" + game.cash;
    lockWager(false);
    turnOff(game.btnHit);
    turnOff(game.btnStand);
    turnOn(game.btnDeal);
  }

  function dealerPlay() {
    let dealer = scorer(game.dealerHand);
    game.cardBack.style.display = "none";
    setTimeout(() => {
      game.dealerCards
        .querySelector(".card")
        .querySelector(".thecard").style.transform = "rotateY(180deg)";
      game.dealerCards
        .querySelector(".card")
        .querySelector(".thecard").style.transition = "transform 0.3s";
    }, 500);
    // game.status.textContent = "Dealer score" + dealer + "";
    if (dealer >= 17) {
      game.dealerScore.textContent = dealer;
      findWinner();
    } else {
      takeCard(game.dealerHand, game.dealerCards, false);
      game.dealerScore.textContent = dealer;
      dealerPlay();
    }
  }

  function updateCount() {
    let player = scorer(game.playerHand);
    let dealer = scorer(game.dealerHand);
    game.playerScore.textContent = player;

    if (player < 21) {
      turnOn(game.btnHit);
      turnOn(game.btnStand);
      // game.status.textContent = "Stand or take another card";
    } else if (player > 21) {
      findWinner();
    } else {
      // game.status.textContent = "Dealer in play to 17 minimum";
      dealerPlay(dealer);
    }
    if (dealer == 21 && game.dealerHand.length == 2) {
      // game.status.textContent = "Dealer got BlackJack";
      gameEnd();
      findWinner();
    }
  }

  function scoreAce(val, aces) {
    if (val < 21) {
      return val;
    } else if (aces > 0) {
      aces--;
      val = val - 10;
      return scoreAce(val, aces);
    } else {
      return val;
    }
  }

  function scorer(hand) {
    let total = 0;
    let ace = 0;
    hand.forEach(function (card) {
      if (card.rank == "A") {
        ace++;
      }
      total = total + Number(card.value);
    });
    if (ace > 0 && total > 21) {
      total = scoreAce(total, ace);
    }
    if (total > 21) {
      gameEnd();
      return Number(total);
    }
    return Number(total);
  }

  function gameEnd() {
    turnOff(game.btnHit);
    turnOff(game.btnStand);
  }

  function takeCard(hand, ele, h,index) {
    if (game.deck.length == 0) {
      buildDeck();
    }
    let temp = game.deck.shift();
    hand.push(temp);
    setTimeout(() => {
      showCard(temp, ele, h);
  }, index * 500);
    if (h) {
      game.cardBack = document.createElement("div");
      game.cardBack.classList.add("cardB");
      game.cardBack.classList.add("slide-down");
      ele.append(game.cardBack);
    }
  }

  function showCard(card, el, h) {
    if (card != undefined) {
      let div = document.createElement("div");
      let theCard = document.createElement("div");
      let theFront = document.createElement("div");
      let theBack = document.createElement("div");
      if (!h) {
        setTimeout(() => {
          theCard.style.transform = "rotateY(180deg)";
          theCard.style.transition = "transform 0.3s";
        }, 500);
      }

      div.append(theCard);
      theCard.append(theFront);
      theCard.append(theBack);
      theCard.classList.add("thecard");
      theFront.classList.add("thefront");
      theBack.classList.add("theback");
      div.classList.add("card");
      div.classList.add("slide-down");
      if (card.suit === "hearts" || card.suit === "diams") {
        div.classList.add("red");
      }
      let span2 = document.createElement("div");
      span2.innerHTML = card.rank;
      span2.classList.add("big");
      theFront.appendChild(span2);
      let span3 = document.createElement("div");
      span3.innerHTML = "&" + card.suit + ";";
      span3.classList.add("big");
      theFront.appendChild(span3);
      el.appendChild(div);
    }
  }
  function showResult() {
   game.player.append(game.playerScore);
  }

  function turnOff(btn) {
    btn.disabled = true;
    btn.style.backgroundColor = "#343843";
    btn.style.color = "#8A8A8A";
    btn.style.opacity = "0.7";
  }

  function turnOn(btn) {
    btn.disabled = false;
    if (!btn.querySelector("svg")) {
      btn.style.backgroundColor = "#7717FF";
    } else {
      btn.style.backgroundColor = "#000";
    }
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
    btn.style.color = "#fff";
  }

  function buildDeck() {
    game.deck = [];
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
        let card = {};
        let tempValue = isNaN(ranks[j]) ? 10 : ranks[j];
        tempValue = ranks[j] == "A" ? 11 : tempValue;
        card.suit = suits[i];
        card.rank = ranks[j];
        card.value = tempValue;
        game.deck.push(card);
      }
    }
    shuffle(game.deck);
  }

  function shuffle(cards) {
    cards.sort(function () {
      return 0.5 - Math.random();
    });
    return cards;
  }

  function buildGameBoard() {
    game.main = document.querySelector("#game");
    // game.scoreboard = document.createElement("div");
    // game.scoreboard.textContent = "Dealer 0 vs Player 0";
    // game.scoreboard.style.fontSize = "2em";
    // game.main.append(game.scoreboard);
    game.table = document.createElement("div");
    game.table.classList.add("game-container");
    game.cardSection = document.createElement("div");
    game.cardSection.classList.add("card-section");
    game.dealer = document.createElement("div");
    game.dealer.classList.add("score-container");
    game.dealerCards = document.createElement("div");
    game.dealerCards.textContent = "DEALER CARD";
    game.dealerCards.classList.add("card-container");
    game.dealerScore = document.createElement("div");
    game.dealerScore.textContent = "-";
    game.dealerScore.classList.add("score");
    game.dealer.style.position = "relative";
    game.dealer.append(game.dealerScore);
    game.cardSection.append(game.dealer);
    game.dealer.append(game.dealerCards);
    game.player = document.createElement("div");
    game.player.classList.add("score-container");
    game.playerCards = document.createElement("div");
    game.playerCards.textContent = "PLAYER CARD";
    game.playerScore = document.createElement("div");
    game.playerScore.textContent = "-";
    game.playerScore.classList.add("score");
    game.playerCards.classList.add("card-container");
    game.cardSection.append(game.player);
    game.player.append(game.playerCards);
   
    game.dashboard = document.createElement("div");
    game.buttonContainer = document.createElement("div");
    game.buttonContainer.classList.add("btn-container");
    // game.status = document.createElement("div");
    // game.status.classList.add("message");
    // game.status.textContent = "Message for Player";
    // game.dashboard.append(game.status);
    game.btnDeal = document.createElement("button");
    game.btnDeal.textContent = "Deal";
    game.btnDeal.classList.add("btn");

    game.btnStand = document.createElement("button");
    game.btnStand.classList.add("btn");
    game.btnHit = document.createElement("button");
    game.btnHit.classList.add("btn");
    game.buttonContainer.append(game.btnHit);
    const svgString =
      '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#hit_svg__a)" fill="#3DD179"><path d="M4.538 9.309a.5.5 0 0 0 .108.545l3 3a.5.5 0 0 0 .707 0l3-3A.5.5 0 0 0 11 9H9V1a1 1 0 1 0-2 0v8H5a.5.5 0 0 0-.462.309Z"></path><path d="m15.994 14.89-1-9A1 1 0 0 0 14 5h-3v2h2.1l.78 7H2.116L2.9 7H5V5H2a1 1 0 0 0-.994.89l-1 9A1 1 0 0 0 1 16h14a1 1 0 0 0 .994-1.11Z"></path></g><defs><clipPath id="hit_svg__a"><path fill="#fff" d="M0 0h16v16H0z"></path></clipPath></defs></svg>';
    const parser = new DOMParser();
    const svgElement = parser
      .parseFromString(svgString, "image/svg+xml")
      .querySelector("svg");
    const textElement = document.createElement("p");
    textElement.textContent = "Hit";

    game.btnHit.appendChild(textElement);
    game.btnHit.appendChild(svgElement);

    game.buttonContainer.append(game.btnStand);
    game.btnSplit = document.createElement("button");
    const svgStatndString =
      '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#stand_svg__a)"><path d="M15 2a1 1 0 0 0-1 1v4a.5.5 0 0 1-1 0V1.553a1.037 1.037 0 0 0-.832-1.04A1 1 0 0 0 11 1.5V7a.5.5 0 0 1-1 0V1.053A1.037 1.037 0 0 0 9.168.014 1 1 0 0 0 8 1v6a.5.5 0 0 1-1 0V1.553A1.037 1.037 0 0 0 6.168.514 1 1 0 0 0 5 1.5v7.793a.5.5 0 0 1-.854.354l-2-2A1.08 1.08 0 0 0 .91 7.4a1.032 1.032 0 0 0-.442 1.434l2.31 4.108A6 6 0 0 0 8.01 16h1.99a6 6 0 0 0 6-6V3a1 1 0 0 0-1-1Z" fill="#F1323E"></path></g><defs><clipPath id="stand_svg__a"><path fill="#fff" d="M0 0h16v16H0z"></path></clipPath></defs></svg>';
    const parserStatnd = new DOMParser();
    const svgStatndElement = parserStatnd
      .parseFromString(svgStatndString, "image/svg+xml")
      .querySelector("svg");
    const textStatndElement = document.createElement("p");
    textStatndElement.textContent = "Stand";

    game.btnStand.appendChild(textStatndElement);
    game.btnStand.appendChild(svgStatndElement);

    const svgSplitString =
      '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#split_svg__a)" fill="#4185F0"><path d="M15.5 0h-5a.5.5 0 0 0-.354.854l1.793 1.792-1.646 1.647a1 1 0 1 0 1.414 1.414l1.647-1.646 1.792 1.793A.5.5 0 0 0 16 5.5v-5a.5.5 0 0 0-.5-.5ZM4.061 2.646 5.854.854A.5.5 0 0 0 5.5 0h-5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .854.354l1.792-1.793L7 8.414V15a1 1 0 1 0 2 0V8a1 1 0 0 0-.293-.707L4.061 2.646Z"></path></g><defs><clipPath id="split_svg__a"><path fill="#fff" d="M0 0h16v16H0z"></path></clipPath></defs></svg>';
    const parserSplit = new DOMParser();
    const svgSplitElement = parserSplit
      .parseFromString(svgSplitString, "image/svg+xml")
      .querySelector("svg");
    const textSplitElement = document.createElement("p");
    textSplitElement.textContent = "Split";

    game.btnSplit.appendChild(textSplitElement);
    game.btnSplit.appendChild(svgSplitElement);

    game.btnSplit.classList.add("btn");
    game.buttonContainer.append(game.btnSplit);
    game.btnDouble = document.createElement("button");
    game.btnDouble.classList.add("btn");
    game.buttonContainer.append(game.btnDouble);
    const svgDoubleString =
      '<svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#double_svg__a)" fill="#FFC634"><path d="M9 0H1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1Z"></path><path d="m15.124 4.085-3-.375-.248 1.984 2.007.251-.995 7.938-6.946-.871L5.694 15l7.938 1a1 1 0 0 0 1.117-.868L15.992 5.2a1 1 0 0 0-.868-1.115Z"></path></g><defs><clipPath id="double_svg__a"><path fill="#fff" d="M0 0h16v16H0z"></path></clipPath></defs></svg>';
    const parserDouble = new DOMParser();
    const svgDoubleElement = parserDouble
      .parseFromString(svgDoubleString, "image/svg+xml")
      .querySelector("svg");
    const textDoubleElement = document.createElement("p");
    textDoubleElement.textContent = "Double";

    game.btnDouble.appendChild(textDoubleElement);
    game.btnDouble.appendChild(svgDoubleElement);
    game.buttonContainer.append(game.btnDeal);
    game.dashboard.append(game.buttonContainer);
    game.playerCash = document.createElement("div");
    game.playerCash.classList.add("message");
    game.playerCash.style.display = "none";
    game.playerCash.textContent = "Player Cash $100";
    game.dashboard.append(game.playerCash);
    game.inputBet = document.createElement("input");
    game.inputBet.setAttribute("type", "number");
    game.inputBet.style.width = "4em";
    game.inputBet.style.display = "none";
    game.inputBet.style.fontSize = "1.4em";
    game.inputBet.style.marginTop = "1em";
    game.inputBet.value = 0;
    game.dashboard.append(game.inputBet);
    game.betButton = document.createElement("button");
    game.betButton.textContent = "Bet Amount";
    game.betButton.classList.add("btn");
    game.betButton.style.display = "none";
    game.dashboard.append(game.betButton);
    game.dashboard.classList.add("sidebar");
    game.table.append(game.dashboard);
    game.table.append(game.cardSection);

    game.main.append(game.table);
  }
  return {
    init: init,
  };
})();
