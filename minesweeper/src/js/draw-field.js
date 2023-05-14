export default function drawField(size, level) {
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
