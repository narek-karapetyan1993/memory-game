const resetLink = document.querySelector('.reset__game');
const form = document.querySelector('.form');
const formInput = document.querySelector('.form__input');
const formButton = document.querySelector('.form__btn');
const gameBoard = document.querySelector('.game__board');
const restartBtn = document.querySelector('.again__btn');
const again = document.querySelector('.again');
const timerShow = document.getElementById('timer');

let hasFlippedCard = false;
let firstCard, secondCard;
let blockBoard = false;
let flippedCards = 0;

function createGameCard() {
  let gameCard = document.createElement('li');
  let cardFront = document.createElement('div');
  let cardBack = document.createElement('div');

  gameCard.classList.add('game__card');
  cardFront.classList.add('game__card-front');
  cardBack.classList.add('game__card-back');

  gameCard.append(cardFront);
  gameCard.append(cardBack);

  return {
    gameCard,
    cardFront,
    cardBack,
  };
}

function createGameBoard() {
  let gameBoardWidth = gameBoard.offsetWidth;
  let gameBoardHeight = gameBoard.offsetHeight;

  let inputValue = formInput.value;
  let cardsNumber = inputValue * inputValue;

  for (let index = 1; index < cardsNumber + 1; index++) {
    let card = createGameCard();

    let cardWidth = (gameBoardWidth - 8 * (inputValue - 1)) / inputValue;
    let cardHeight = (gameBoardHeight - 8 * (inputValue - 1)) / inputValue;
    card.gameCard.style.width = cardWidth + 'px';
    card.gameCard.style.height = cardHeight + 'px';

    card.cardFront.textContent = Math.ceil(index / 2);
    card.cardFront.style.paddingTop = cardHeight * (25 / 100) + 'px';
    card.cardFront.style.fontSize = cardHeight * (50 / 100) + 'px';

    let randomPosition = Math.floor(Math.random() * 1235);
    card.gameCard.style.order = randomPosition;

    gameBoard.append(card.gameCard);
    card.gameCard.addEventListener('click', flipCard);
  }
}

function startGame() {
  formButton.addEventListener('click', function (e) {
    e.preventDefault();

    let inputValue = formInput.value;

    if (inputValue >= 2 && inputValue <= 10 && inputValue % 2 == 0) {
      gameBoard.style.display = 'flex';
      form.style.display = 'none';
      createGameBoard();
    } else if (inputValue == '') {
      formInput.value = 4;
      gameBoard.style.display = 'flex';
      form.style.display = 'none';
      createGameBoard();
    } else {
      formInput.value = 4;
      gameBoard.style.display = 'flex';
      form.style.display = 'none';
      createGameBoard();
    }

    resetLink.style.display = 'block';

    timeoutGame();
  });
}

function timer(timer) {
  let timeMinut = timer / 1000;
  setInterval(() => {
    const seconds = timeMinut % 60;
    const minutes = (timeMinut / 60) % 60;
    if (timeMinut <= 0) {
      clearInterval(timer);
    } else {
      let strTimer = `${Math.trunc(minutes)}:${seconds}`;
      timerShow.innerHTML = strTimer;
    }
    --timeMinut;
  }, 1000);
}

function timeoutGame() {
  const timeOut = Number(formInput.value) * 15000;
  timer(timeOut);
  setTimeout(() => {
    gameBoard.innerHTML = '';
    createGameBoard();
    again.style.display = 'none';
    flippedCards = 0;
    restartGame();
    timeoutGame();
  }, timeOut);
}

function flipCard() {
  if (blockBoard) return;
  if (this === firstCard) return;
  this.classList.toggle('card__flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  hasFlippedCard = false;
  checkForMath();
}

function checkForMath() {
  if (firstCard.firstChild.textContent === secondCard.firstChild.textContent) {
    flippedCards += 2;
    restartGame();
    disableCards();
    return;
  }

  unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  blockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('card__flip');
    secondCard.classList.remove('card__flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  hasFlippedCard = blockBoard = false;
  firstCard = secondCard = null;
}

function restartGame() {
  if (flippedCards === gameBoard.childNodes.length) {
    setTimeout(() => {
      again.style.display = 'flex';
    }, 500);
  }

  restartBtn.addEventListener('click', () => {
    setTimeout(() => {
      gameBoard.innerHTML = '';
      createGameBoard();
      again.style.display = 'none';
      flippedCards = 0;
      restartGame();
      timeoutGame();
    }, 500);
  });
}

startGame();
