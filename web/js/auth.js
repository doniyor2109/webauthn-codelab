import {
  authenticate,
  loginWithPassword,
  getUserCredentials,
} from '/js/utils.js';
const form = document.querySelector('#form');

new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = new FormData(event.target);
  const value = Object.fromEntries(form.entries());

  try {
    await loginWithPassword(value);
    window.location.href = '/home';
  } catch (error) {
    alert(error.message);
  }
});

async function showPublicKeyAuthentication() {
  if (!window.PublicKeyCredential) {
    return false;
  }

  const uvpaa =
    await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

  if (!uvpaa) {
    return false;
  }

  try {
    const res = await getUserCredentials();
    if (res.credentials.length === 0) {
      return false;
    }
  } catch (error) {
    return false;
  }

  return true;
}

showPublicKeyAuthentication().then((show) => {
  if (show) {
    document.querySelector('#uvpa_available').classList.remove('hidden');
  } else {
    form.classList.remove('hidden');
  }
});

const cancel = document.querySelector('#cancel');
cancel.addEventListener('click', (e) => {
  form.classList.remove('hidden');
  document.querySelector('#uvpa_available').classList.add('hidden');
});

const button = document.querySelector('#auth');
button.addEventListener('click', async () => {
  try {
    const user = await authenticate();

    if (user) {
      location.href = '/home';
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    alert('Authentication failed. Use password to sign-in.');
    form.classList.remove('hidden');
    document.querySelector('#uvpa_available').classList.add('hidden');
  }
});
