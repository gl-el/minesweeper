import Builder from './element-builder.js';

const modal = {

  buildModal() {
    const modalWindow = document.createElement('div');
    modalWindow.setAttribute('class', 'modal');
    new Builder('h2', { class: 'modal__header' }, modalWindow).insert();
    new Builder('div', { class: 'modal__content' }, modalWindow).insert();
    new Builder('button', { class: 'btn btn__modal material-symbols-outlined' }, modalWindow, 'close').insert();
    document.body.append(modalWindow);
    new Builder('div', { class: 'modal__before' }, document.body).insert();
  },

  buildList(arr, target) {
    const ul = document.createElement('ul');
    ul.setAttribute('class', 'modal__results');
    arr.reverse().forEach((item) => {
      new Builder('li', { class: `list__item list__item_${item[0]}` }, ul, `${item[1]}x${item[1]} field, ${item[2]} bombs in ${item[3]} sec and ${item[4]} clicks `).insert();
    });
    target.append(ul);
  },

  removeContent() {
    const content = document.querySelector('.modal__content');
    content.replaceChildren();
  },

  show(headText, content) {
    const header = document.querySelector('.modal__header');
    const message = document.querySelector('.modal__content');
    const modalWindow = document.querySelector('.modal');
    header.textContent = headText;
    if (typeof content === 'object') {
      this.buildList(content, message);
    } else {
      message.textContent = content;
    }
    modalWindow.classList.add('modal_active');
  },

  close() {
    const modalWindow = document.querySelector('.modal');
    this.removeContent();
    modalWindow.classList.remove('modal_active');
  },
};

export default modal;
