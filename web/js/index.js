import { sendUsername } from '/js/utils.js';

new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));
const form = document.querySelector('#form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = new FormData(event.target);
  const value = Object.fromEntries(form.entries());

  try {
    await sendUsername(value);
    window.location.href = '/auth';
  } catch (error) {
    alert(error.message);
  }
});
