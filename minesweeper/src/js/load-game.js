export default function loadGame(isSave) {
  const level = localStorage.getItem('level') === null || !isSave ? 'easy' : localStorage.getItem('level');
  if (isSave) {
    const field = document.querySelector('.field');
    field.innerHTML = localStorage.getItem('field');
    const levels = document.querySelectorAll('.level');
    levels.forEach((item) => {
      if (item.value === level) {
        item.setAttribute('checked', 'true');
      }
    });
  }
}
