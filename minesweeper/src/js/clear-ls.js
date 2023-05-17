export default function clear() {
  localStorage.removeItem('isSave');
  localStorage.removeItem('bombs');
  localStorage.removeItem('bombsCounter');
  localStorage.removeItem('seconds');
  localStorage.removeItem('field');
  localStorage.removeItem('clickCounter');
  localStorage.removeItem('flagsCounter');
  localStorage.removeItem('fieldArr');
  localStorage.removeItem('level');
  localStorage.removeItem('fieldSide');
  localStorage.removeItem('bombsQty');
}
