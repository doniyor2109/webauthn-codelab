import { showPublicKeyAuthentication, verifyLogin } from './lib/utils.js';
import * as api from './lib/api.js';

const form = document.querySelector('#form');

new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));

function hideDeviceLogin() {
  form.classList.remove('hidden');
  document.querySelector('#uvpa_available').classList.add('hidden');
}

showPublicKeyAuthentication().then((show) => {
  if (show) {
    document.querySelector('#uvpa_available').classList.remove('hidden');
  } else {
    form.classList.remove('hidden');
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = new FormData(event.target);
  const value = Object.fromEntries(form.entries());

  try {
    await api.loginWithPassword(value);
    window.location.href = '/home';
  } catch (error) {
    alert(error.message);
  }
});

const cancel = document.querySelector('#cancel');
cancel.addEventListener('click', (e) => {
  form.classList.remove('hidden');
  document.querySelector('#uvpa_available').classList.add('hidden');
});

/**
 * TODO 4
 *
 * 1. Get add button with id #auth-with-device
 * 2. Add click handler
 * 3. Get challenge from Server
 * 4. Verify Login for Browser
 * 5. Redirect to /home when success
 * */
