import Builder from './js/element-builder.js';

let clickCounter = 0;
let isStart = true;
let isPlay = true;
let fieldArr = [];
let bombs = [];
let bombsQty = 10;
let fieldSide = 10;
let level = 'easy';
let flagsCounter = bombsQty;
let seconds = 0;

function drawField() {
  const size = fieldSide;
  const field = [];
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const card = document.createElement('div');
      card.setAttribute('class', `card card_${level}`);
      card.setAttribute('data-cord', `${i},${j}`);
      field.push(card);
    }
  }
  return field;
}

function drawPage() {
  const body = document.querySelector('body');
  const field = document.createElement('div');
  field.setAttribute('class', 'field');
  field.replaceChildren(...drawField());
  body.append(field);
  const top = document.createElement('div');
  top.setAttribute('class', 'top');
  new Builder('button', { class: 'btn btn_restart material-symbols-outlined' }, top, 'replay').insert();
  new Builder('button', { class: 'btn btn_sound material-symbols-outlined' }, top, 'volume_off').insert();
  new Builder('button', { class: 'btn btn_light material-symbols-outlined' }, top, 'light_mode').insert();
  const settings = document.createElement('div');
  settings.setAttribute('class', 'game-settings');
  new Builder('input', {
    type: 'radio',
    id: 'easy',
    class: 'level',
    name: 'level',
    value: 'easy',
    checked: 'true',
  }, settings).insert();
  new Builder('label', { for: 'easy' }, settings, '10x10').insert();
  new Builder('label', { class: 'bombs-qty', for: 'bombsQty' }, settings, `💣: ${bombsQty}`).insert();
  new Builder('input', {
    type: 'radio',
    id: 'medium',
    class: 'level',
    name: 'level',
    value: 'medium',
  }, settings).insert();
  new Builder('label', { for: 'medium' }, settings, '15x15').insert();
  new Builder('input', {
    type: 'range',
    id: 'bombsQty',
    class: 'slider',
    name: 'bombsQty',
    min: '1',
    max: '99',
    value: '10',
    step: '1',
  }, settings).insert();
  new Builder('input', {
    type: 'radio',
    id: 'hard',
    class: 'level',
    name: 'level',
    value: 'hard',
  }, settings).insert();
  new Builder('label', { for: 'hard' }, settings, '25x25').insert();
  body.prepend(top, settings);
  const bottom = document.createElement('div');
  bottom.setAttribute('class', 'bottom text');
  new Builder('span', { class: '' }, bottom, 'Clicks: ').insert();
  new Builder('span', { class: 'counter' }, bottom, '0').insert();
  new Builder('span', { class: 'ico ico__time material-symbols-outlined' }, bottom, 'hourglass_empty').insert();
  new Builder('span', { class: 'time-counter' }, bottom, `${seconds} s`).insert();
  new Builder('span', { class: 'ico material-symbols-outlined' }, bottom, 'flag').insert();
  new Builder('span', { class: 'flags' }, bottom, `${flagsCounter}`).insert();
  body.append(bottom);
  new Builder('div', { class: 'score' }, body).insert();
}

drawPage();

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

function createField(size, bombs) {
  const field = Array(size).fill().map(() => Array(size).fill(0));
  const score = document.querySelector('.score');
  score.textContent = '';
  bombs.forEach((item) => {
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
  flags.textContent = `${flagsCounter}`;
}

function startTimer() {
  const time = document.querySelector('.time-counter');
  seconds += 1;
  time.textContent = `${seconds} s`;
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
  } else if (command === 'stop') {
    clearInterval(intervalID);
    clocks.classList.remove('ico__time_active');
  } else if (command === 'restart') {
    clearInterval(intervalID);
    clocks.classList.remove('ico__time_active');
    endTimer();
  }
}

function restartGame() {
  flagsCounter = bombs.length;
  clickCounter = 0;
  isPlay = true;
  isStart = true;
  updateClicks();
  updateFlags();
  timer('restart');
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.removeAttribute('data-empty');
    card.removeAttribute('data-flag');
    card.textContent = '';
    card.classList = '';
    card.setAttribute('class', `card card_${level}`);
  });
}

function revealCards(field, x, y, target) {
  if (field[x][y] === 0 && target.dataset.empty !== 'true') {
    target.setAttribute('data-empty', 'true');
    target.classList.add('card_active');
    revealCards(field, Math.max(0, x - 1), Math.max(0, y - 1), document.querySelector(`[data-cord="${Math.max(0, x - 1)},${Math.max(0, y - 1)}"]`));
    revealCards(field, Math.max(0, x - 1), Math.max(0, y), document.querySelector(`[data-cord="${Math.max(0, x - 1)},${Math.max(0, y)}"]`));
    revealCards(field, Math.max(0, x - 1), Math.min(field.length - 1, y + 1), document.querySelector(`[data-cord="${Math.max(0, x - 1)},${Math.min(field.length - 1, y + 1)}"]`));
    revealCards(field, x, Math.max(0, y - 1), document.querySelector(`[data-cord="${x},${Math.max(0, y - 1)}"]`));
    revealCards(field, x, Math.min(field.length - 1, y + 1), document.querySelector(`[data-cord="${x},${Math.min(field.length - 1, y + 1)}"]`));
    revealCards(field, Math.min(field.length - 1, x + 1), Math.max(0, y - 1), document.querySelector(`[data-cord="${Math.min(field.length - 1, x + 1)},${Math.max(0, y - 1)}"]`));
    revealCards(field, Math.min(field.length - 1, x + 1), Math.max(0, y), document.querySelector(`[data-cord="${Math.min(field.length - 1, x + 1)},${Math.max(0, y)}"]`));
    revealCards(field, Math.min(field.length - 1, x + 1), Math.min(field.length - 1, y + 1), document.querySelector(`[data-cord="${Math.min(field.length - 1, x + 1)},${Math.min(field.length - 1, y + 1)}"]`));
  }
}

function showBombs() {
  bombs.forEach((bomb) => {
    const x = bomb.split(',')[0];
    const y = bomb.split(',')[1];
    const bombCard = document.querySelector(`[data-cord="${x},${y}"]`);
    bombCard.textContent = '💣';
    bombCard.classList.remove('card_active');
    bombCard.classList.add('card_bomb');
  });
}

function checkWin(all, target) {
  const empty = document.querySelectorAll('[data-empty="true"]').length;
  const score = document.querySelector('.score');
  if (bombs.includes(target)) {
    score.textContent = `You loose on ${clickCounter} click!`;
    isPlay = false;
    timer('stop');
  }
  if (bombs.length === all ** 2 - empty) {
    score.textContent = `You win in ${clickCounter} clicks!`;
    isPlay = false;
    timer('stop');
  }
}

const field = document.querySelector('.field');
field.addEventListener('click', (e) => {
  if (e.target.dataset.flag === 'true' || e.target.dataset.empty === 'true' || !isPlay) return;
  const point = e.target.dataset.cord;
  const x = +point.split(',')[0];
  const y = +point.split(',')[1];
  if (isStart) {
    bombs = createBombs(bombsQty, fieldSide, point);
    fieldArr = createField(fieldSide, bombs);
    isStart = false;
    timer('start');
    console.log(fieldArr);
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
  e.target.classList.add('card_active');
  clickCounter += 1;
  updateClicks();
  checkWin(fieldArr.length, point);
});

field.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (!isPlay) return;
  if (!isStart && e.target.dataset.empty !== 'true') {
    if (flagsCounter > 0 && e.target.textContent !== '🚩') {
      flagsCounter -= 1;
      e.target.textContent = '🚩';
      e.target.setAttribute('data-flag', 'true');
    } else {
      flagsCounter += 1;
      e.target.removeAttribute('data-flag');
      e.target.textContent = '';
    }
  }
  updateFlags();
});

const restart = document.querySelector('.btn_restart');
restart.addEventListener('click', (e) => {
  restartGame();
});

function changeLevel(newLevel) {
  const fieldUpd = document.querySelector('.field');
  if (newLevel === 'easy') {
    level = 'easy';
    fieldSide = 10;
  } else if (newLevel === 'medium') {
    level = 'medium';
    fieldSide = 15;
  } else if (newLevel === 'hard') {
    level = 'hard';
    fieldSide = 25;
  }
  fieldUpd.replaceChildren(...drawField());
}

const radioBtns = document.querySelectorAll('.level');
radioBtns.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (e.target.value !== level) {
      changeLevel(e.target.value);
      restartGame();
    }
  });
});

const slider = document.querySelector('.slider');
slider.addEventListener('input', (e) => {
  const bombsQtyText = document.querySelector('.bombs-qty');
  bombsQty = e.target.value;
  bombsQtyText.textContent = `💣: ${bombsQty}`;
});

slider.addEventListener('change', () => {
  restartGame();
});
