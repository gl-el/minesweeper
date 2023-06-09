import './index.html';
import './style.css';
import click from './audio/click.wav';
import lose from './audio/lose.wav';
import win from './audio/win.wav';
import flag from './audio/flag.wav';
import themeSwitcher from './js/theme-switcher';
import Results from './js/results';
import modal from './js/modal';
import drawField from './js/draw-field';
import drawPage from './js/draw-page';
import loadGame from './js/load-game';
import clear from './js/clear-ls';

let clickCounter = localStorage.getItem('clickCounter') === null ? 0 : +localStorage.getItem('clickCounter');
let isStart = localStorage.getItem('isSave') === null;
const isSave = localStorage.getItem('isSave') === 'true';
let isPlay = true;
let isTimer = false;
let fieldArr = localStorage.getItem('fieldArr') === null ? [] : JSON.parse(localStorage.getItem('fieldArr'));
let bombs = localStorage.getItem('bombs') === null ? [] : JSON.parse(localStorage.getItem('bombs'));
let bombsQty = !isSave ? 10 : bombs.length;
let fieldSide = localStorage.getItem('fieldSide') === null || !isSave ? 10 : +localStorage.getItem('fieldSide');
let level = localStorage.getItem('level') === null || !isSave ? 'easy' : localStorage.getItem('level');
let flagsCounter = localStorage.getItem('flagsCounter') === null || !isSave ? 0 : +localStorage.getItem('flagsCounter');
let bombsCounter = localStorage.getItem('bombsCounter') === null || !isSave ? bombsQty : +localStorage.getItem('bombsCounter');
let seconds = localStorage.getItem('seconds') === null || !isSave ? 0 : +localStorage.getItem('seconds');
let isSound = localStorage.getItem('sound') === null ? 'on' : localStorage.getItem('sound');
const results = new Results();

drawPage(fieldSide, level, isSound, bombsQty, flagsCounter, seconds, bombsCounter, clickCounter);
themeSwitcher();
modal.buildModal();
loadGame(isSave);

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function createBombs(quantity, size, point) {
  const bombsArr = [];
  while (bombsArr.length < quantity) {
    const coord = `${getRandom(0, size)},${getRandom(0, size)}`;
    if (!bombsArr.includes(coord) && coord !== point) bombsArr.push(coord);
  }
  return bombsArr;
}

function createField(size, bombsArr) {
  const field = Array(size).fill().map(() => Array(size).fill(0));
  bombsArr.forEach((item) => {
    const x = item.split(',')[0];
    const y = item.split(',')[1];
    field[x][y] = 'B';
  });
  for (let i = 0; i < field.length; i += 1) {
    for (let j = 0; j < field[i].length; j += 1) {
      if (field[i][j] === 'B') {
        for (let tempI = Math.max(0, i - 1); tempI < Math.min(field.length, i + 2); tempI += 1) {
          for (let tempJ = Math.max(0, j - 1); tempJ < Math.min(field.length, j + 2); tempJ += 1) {
            if (field[tempI][tempJ] !== 'B') field[tempI][tempJ] += 1;
          }
        }
      }
    }
  }
  return field;
}

function updateClicks() {
  const clicks = document.querySelector('.counter');
  clicks.textContent = `${clickCounter}`;
}

function updateFlags() {
  const flags = document.querySelector('.flags');
  const bombsText = document.querySelector('.bombs-counter');
  flags.textContent = `${flagsCounter}`;
  bombsText.textContent = `${bombsCounter}`;
  localStorage.setItem('flagsCounter', `${flagsCounter}`);
  localStorage.setItem('bombsCounter', `${bombsCounter}`);
}

function startTimer() {
  const time = document.querySelector('.time-counter');
  seconds += 1;
  time.textContent = `${seconds} s`;
  localStorage.setItem('seconds', `${seconds}`);
}

function endTimer() {
  const time = document.querySelector('.time-counter');
  seconds = 0;
  time.textContent = `${seconds} s`;
}

let intervalID;
function timer(command) {
  const clocks = document.querySelector('.ico__time');
  if (command === 'start') {
    intervalID = setInterval(startTimer, 1000);
    clocks.classList.add('ico__time_active');
    isTimer = true;
  } else if (command === 'stop') {
    clearInterval(intervalID);
    clocks.classList.remove('ico__time_active');
    isTimer = false;
  } else if (command === 'restart') {
    clearInterval(intervalID);
    clocks.classList.remove('ico__time_active');
    isTimer = false;
    endTimer();
  }
}

function restartGame() {
  flagsCounter = 0;
  bombsCounter = bombsQty;
  clickCounter = 0;
  isPlay = true;
  isStart = true;
  isTimer = false;
  fieldArr = [];
  bombs = [];
  updateClicks();
  updateFlags();
  timer('stop');
  timer('restart');
  const cards = document.querySelectorAll('.card');
  for (let i = 0; i < cards.length; i += 1) {
    cards[i].removeAttribute('data-empty');
    cards[i].removeAttribute('data-flag');
    cards[i].textContent = '';
    cards[i].classList = '';
    cards[i].setAttribute('class', `card card_${level}`);
  }
  if (level === 'easy') {
    fieldSide = 10;
  } else if (level === 'medium') {
    fieldSide = 15;
  } else if (level === 'hard') {
    fieldSide = 25;
  }
}

function revealCards(field, x, y, target) {
  const text = target;
  if (field[x][y] === 0 && target.dataset.empty !== 'true' && target.dataset.flag !== 'true') {
    target.setAttribute('data-empty', 'true');
    target.classList.add('card_opened');
    revealCards(field, Math.max(0, x - 1), Math.max(0, y - 1), document.querySelector(`[data-cord="${Math.max(0, x - 1)},${Math.max(0, y - 1)}"]`));
    revealCards(field, Math.max(0, x - 1), Math.max(0, y), document.querySelector(`[data-cord="${Math.max(0, x - 1)},${Math.max(0, y)}"]`));
    revealCards(field, Math.max(0, x - 1), Math.min(field.length - 1, y + 1), document.querySelector(`[data-cord="${Math.max(0, x - 1)},${Math.min(field.length - 1, y + 1)}"]`));
    revealCards(field, x, Math.max(0, y - 1), document.querySelector(`[data-cord="${x},${Math.max(0, y - 1)}"]`));
    revealCards(field, x, Math.min(field.length - 1, y + 1), document.querySelector(`[data-cord="${x},${Math.min(field.length - 1, y + 1)}"]`));
    revealCards(field, Math.min(field.length - 1, x + 1), Math.max(0, y - 1), document.querySelector(`[data-cord="${Math.min(field.length - 1, x + 1)},${Math.max(0, y - 1)}"]`));
    revealCards(field, Math.min(field.length - 1, x + 1), Math.max(0, y), document.querySelector(`[data-cord="${Math.min(field.length - 1, x + 1)},${Math.max(0, y)}"]`));
    revealCards(field, Math.min(field.length - 1, x + 1), Math.min(field.length - 1, y + 1), document.querySelector(`[data-cord="${Math.min(field.length - 1, x + 1)},${Math.min(field.length - 1, y + 1)}"]`));
  } else if (field[x][y] !== 'B' && target.dataset.flag !== 'true') {
    target.setAttribute('data-empty', 'true');
    target.classList.add('card_opened');
    if (field[x][y] !== 0) {
      text.textContent = field[x][y];
      target.classList.add(`card-${field[x][y]}`);
    }
  }
}

function showBombs() {
  bombs.forEach((bomb) => {
    const x = bomb.split(',')[0];
    const y = bomb.split(',')[1];
    const bombCard = document.querySelector(`[data-cord="${x},${y}"]`);
    bombCard.classList.remove('card_opened');
    bombCard.classList.add('card_bomb');
  });
}

function playSound(sound) {
  if (isSound === 'on') {
    new Audio(sound).play();
  }
}

function checkWin(all, target) {
  const empty = document.querySelectorAll('[data-empty="true"]').length;
  if (bombs.includes(target)) {
    playSound(lose);
    isPlay = false;
    timer('stop');
    clear();
    modal.show('You lose!', 'Game over. Try again');
  }
  if (bombs.length === all ** 2 - empty) {
    playSound(win);
    isPlay = false;
    timer('stop');
    clear();
    results.addItem('win', fieldArr.length, bombsQty, seconds, clickCounter);
    modal.show('You win!', `Hooray! You found all mines in ${seconds} seconds and ${clickCounter} moves!`);
  }
}

const field = document.querySelector('.field');
field.addEventListener('click', (e) => {
  if (e.target.dataset.flag === 'true' || e.target.dataset.empty === 'true' || !isPlay || e.target.classList.contains('field')) return;
  playSound(click);
  const point = e.target.dataset.cord;
  const x = +point.split(',')[0];
  const y = +point.split(',')[1];
  if (!isTimer) {
    timer('start');
  }
  if (isStart) {
    bombs = createBombs(bombsQty, fieldSide, point);
    fieldArr = createField(fieldSide, bombs);
    isStart = false;
    localStorage.setItem('fieldArr', `${JSON.stringify(fieldArr)}`);
    localStorage.setItem('bombs', `${JSON.stringify(bombs)}`);
  }
  if (e.target.dataset.empty !== 'true') {
    if (bombs.includes(point)) {
      showBombs();
    } else if (fieldArr[x][y] !== 0) {
      e.target.textContent = `${fieldArr[x][y]}`;
      e.target.classList.add(`card-${fieldArr[x][y]}`);
      e.target.setAttribute('data-empty', 'true');
    } else {
      revealCards(fieldArr, x, y, e.target);
    }
  }
  e.target.classList.add('card_opened');
  clickCounter += 1;
  updateClicks();
  localStorage.setItem('isSave', 'true');
  localStorage.setItem('field', `${field.innerHTML}`);
  localStorage.setItem('clickCounter', `${clickCounter}`);
  localStorage.setItem('level', `${level}`);
  checkWin(fieldArr.length, point);
});

field.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (!isPlay) return;
  if (isSave && !isTimer && e.target.dataset.empty !== 'true') {
    timer('start');
  }
  if (!isStart && e.target.dataset.empty !== 'true') {
    if (flagsCounter < bombsQty && e.target.dataset.flag !== 'true') {
      playSound(flag);
      flagsCounter += 1;
      bombsCounter -= 1;
      e.target.classList.add('card_flag');
      e.target.setAttribute('data-flag', 'true');
    } else if (e.target.dataset.flag === 'true') {
      playSound(flag);
      flagsCounter -= 1;
      bombsCounter += 1;
      e.target.removeAttribute('data-flag');
      e.target.classList.remove('card_flag');
    }
  }
  updateFlags();
  localStorage.setItem('field', `${field.innerHTML}`);
});

const restart = document.querySelector('.btn_restart');
restart.addEventListener('click', () => {
  restartGame();
  clear();
});

function updateSlider(target, qty) {
  const slider = target;
  slider.value = qty;
  const bombsQtyText = document.querySelector('.bombs-qty');
  slider.style.backgroundSize = `${((qty - slider.min) * 100) / (slider.max - slider.min)}% 100%`;
  bombsQtyText.textContent = `Bombs quantity: ${bombsQty}`;
}

function changeLevel(newLevel) {
  const fieldUpd = document.querySelector('.field');
  if (newLevel === 'easy') {
    level = 'easy';
    fieldSide = 10;
    bombsQty = 10;
  } else if (newLevel === 'medium') {
    level = 'medium';
    fieldSide = 15;
    bombsQty = 25;
  } else if (newLevel === 'hard') {
    level = 'hard';
    fieldSide = 25;
    bombsQty = 80;
  }
  const slider = document.querySelector('.slider');
  updateSlider(slider, bombsQty);
  fieldUpd.replaceChildren(...drawField(fieldSide, level));
}

const radioBtns = document.querySelectorAll('.level');
radioBtns.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (e.target.value !== level) {
      changeLevel(e.target.value);
      restartGame();
      clear();
      localStorage.setItem('fieldSide', `${fieldSide}`);
    }
  });
});

const slider = document.querySelector('.slider');
slider.addEventListener('input', (e) => {
  bombsQty = e.target.value;
  updateSlider(slider, e.target.value);
});

slider.addEventListener('change', () => {
  restartGame();
  clear();
});

const btnSound = document.querySelector('.btn_sound');
btnSound.addEventListener('click', () => {
  if (isSound === 'on') {
    isSound = 'off';
    btnSound.textContent = 'volume_up';
  } else {
    isSound = 'on';
    btnSound.textContent = 'volume_off';
  }
  localStorage.setItem('sound', `${isSound}`);
});

const btnRes = document.querySelector('.btn_results');
btnRes.addEventListener('click', () => {
  modal.show('Last results:', results.getResults());
});

const btnModalClose = document.querySelector('.btn__modal');
btnModalClose.addEventListener('click', () => {
  modal.close();
});

window.addEventListener('click', (e) => {
  if (e.target === document.querySelector('.modal__before')) {
    modal.close();
  }
});
