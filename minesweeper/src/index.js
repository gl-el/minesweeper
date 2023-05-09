import Builder from './js/element-builder.js';

let clickCounter = 0;
let isStart = true;
let fieldArr = [];
let bombs = [];
let bombsQuantity = 5;
let fieldSide = 10;
let level = 'easy';
let flagsCounter = bombsQuantity;

function drawField() {
  const size = fieldSide;
  const body = document.querySelector('body');
  const field = document.createElement('div');
  field.setAttribute('class', 'field');
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const card = document.createElement('div');
      card.setAttribute('class', `card card_${level}`);
      card.setAttribute('data-cord', `${i},${j}`);
      field.append(card);
    }
  }
  body.append(field);
}

function drawPage() {
  drawField();
  const body = document.querySelector('body');
  const description = document.createElement('div');
  const clicksText = new Builder('span', { class: 'text' }, description, 'Total clicks: ');
  clicksText.insertElement();
  const clicks = new Builder('span', { class: 'text counter' }, description, '0');
  clicks.insertElement();
  body.append(description);
  const score = new Builder('div', { class: 'score' }, body);
  score.insertElement();
}

drawPage();

async function clearField() {
  flagsCounter = bombsQuantity;
  clickCounter = 0;
  const counter = document.querySelector('.counter');
  counter.textContent = `${clickCounter}`;
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.removeAttribute('data-empty');
    card.removeAttribute('data-flag');
    card.textContent = '';
    card.classList.remove('card_active');
    card.classList.remove('card_bomb');
    card.classList.remove('card-1');
    card.classList.remove('card-2');
    card.classList.remove('card-3');
    card.classList.remove('card-4');
    card.classList.remove('card-5');
    card.classList.remove('card-6');
    card.classList.remove('card-7');
    card.classList.remove('card-8');
  });
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function createCard(size) {
  return `${getRandom(0, size)},${getRandom(0, size)}`;
}

function createBombs(quantity, size, point) {
  const bombsArr = [];
  while (bombsArr.length < quantity) {
    const coord = createCard(size);
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
    isStart = true;
  }
  if (bombs.length === all ** 2 - empty) {
    score.textContent = `You win in ${clickCounter} clicks!`;
    isStart = true;
  }
}

const field = document.querySelector('.field');
field.addEventListener('click', async (e) => {
  if (e.target.dataset.flag === 'true' || e.target.dataset.empty === 'true') return;
  const counter = document.querySelector('.counter');
  const point = e.target.dataset.cord;
  const x = +point.split(',')[0];
  const y = +point.split(',')[1];
  if (isStart) {
    await clearField();
    bombs = createBombs(bombsQuantity, fieldSide, point);
    flagsCounter = bombs.length;
    fieldArr = createField(fieldSide, bombs);
    if (fieldArr[x][y] !== 0) {
      e.target.textContent = `${fieldArr[x][y]}`;
      e.target.classList.add(`card-${fieldArr[x][y]}`);
      e.target.setAttribute('data-empty', 'true');
    } else {
      revealCards(fieldArr, x, y, e.target);
    }
    isStart = false;
    console.log(fieldArr);
  } else if (e.target.dataset.empty !== 'true') {
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
  counter.textContent = clickCounter;
  checkWin(fieldArr.length, point);
});

field.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  console.log(!isStart, flagsCounter);
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
});
