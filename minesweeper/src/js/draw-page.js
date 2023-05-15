import Builder from './element-builder';
import drawField from './draw-field';

export default function drawPage(size, lvl, sound, bombs, flags, secs) {
  const body = document.querySelector('body');
  const field = document.createElement('div');
  field.setAttribute('class', 'field');
  field.replaceChildren(...drawField(size, lvl));
  body.append(field);
  const top = document.createElement('div');
  top.setAttribute('class', 'top');
  new Builder('button', { class: 'btn btn_restart material-symbols-outlined' }, top, 'replay').insert();
  new Builder('button', { class: 'btn btn_sound material-symbols-outlined' }, top, `${sound === 'on' ? 'volume_off' : 'volume_up'}`).insert();
  new Builder('button', { class: 'btn btn_light material-symbols-outlined' }, top, 'light_mode').insert();
  new Builder('button', { class: 'btn btn_results material-symbols-outlined' }, top, 'leaderboard').insert();
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
  new Builder('label', { for: 'easy', class: 'radio__label' }, settings, '10x10').insert();
  new Builder('label', { class: 'bombs-qty', for: 'bombsQty' }, settings, `💣: ${bombs}`).insert();
  new Builder('input', {
    type: 'radio',
    id: 'medium',
    class: 'level',
    name: 'level',
    value: 'medium',
  }, settings).insert();
  new Builder('label', { for: 'medium', class: 'radio__label' }, settings, '15x15').insert();
  new Builder('input', {
    type: 'range',
    id: 'bombsQty',
    class: 'slider',
    name: 'bombsQty',
    min: '10',
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
  new Builder('label', { for: 'hard', class: 'radio__label' }, settings, '25x25').insert();
  body.prepend(top, settings);
  const bottom = document.createElement('div');
  bottom.setAttribute('class', 'bottom text');
  new Builder('span', { class: '' }, bottom, 'Clicks: ').insert();
  new Builder('span', { class: 'counter' }, bottom, '0').insert();
  new Builder('span', { class: 'ico ico__time material-symbols-outlined' }, bottom, 'hourglass_empty').insert();
  new Builder('span', { class: 'time-counter' }, bottom, `${secs} s`).insert();
  new Builder('span', { class: 'ico material-symbols-outlined' }, bottom, 'flag').insert();
  new Builder('span', { class: 'flags' }, bottom, `${flags}`).insert();
  body.append(bottom);
}
