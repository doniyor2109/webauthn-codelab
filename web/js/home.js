import { getRegisterChallenge, verifyRegistration } from './lib/utils.js';
import {
  html,
  render,
} from 'https://unpkg.com/lit-html@1.0.0/lit-html.js?module';
import { getUserCredentials, unregisterCredential } from './lib/api.js';

const checkDeviceSupport = () => {
  if (window.PublicKeyCredential) {
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
      (uvpaa) => {
        const addDeviceButton = document.querySelector('#add-device');
        if (uvpaa) {
          addDeviceButton?.classList.remove('hidden');
        } else {
          addDeviceButton?.classList.add('hidden');
          document
            .querySelector('#uvpa_unavailable')
            .classList.remove('hidden');
        }
      }
    );
  } else {
    document.querySelector('#uvpa_unavailable').classList.remove('hidden');
  }
};

const renderCredentialItem = (cred) => {
  return html`<div class="mdc-card credential">
    <span class="mdc-typography mdc-typography--body2">Device Type:</span>
    <pre class="public-key">${cred.transports}</pre>

    <span class="mdc-typography mdc-typography--body2">Credential ID:</span>
    <pre class="public-key">${cred.credId}</pre>

    <span class="mdc-typography mdc-typography--body2">Public Key:</span>
    <pre class="public-key">${cred.publicKey}</pre>
    <div class="mdc-card__actions">
      <mwc-button id="${cred.credId}" @click="${removeCredential}" raised
        >Remove</mwc-button
      >
    </div>
  </div>`;
};

const showCredentials = async () => {
  const { credentials } = await getUserCredentials();
  const list = document.querySelector('#list');

  if (credentials.length > 0) {
    const content = html`${credentials.map(renderCredentialItem)}`;
    render(content, list);
  } else {
    const content = html`<p
      style="color: white;"
      class="mdc-typography mdc-typography--body2"
    >
      No credentials found.
    </p>`;
    render(content, list);
  }
};

const removeCredential = async (event) => {
  try {
    await unregisterCredential(event.target.id);
    await showCredentials();
  } catch (error) {
    alert(error.message);
  }
};

checkDeviceSupport();
showCredentials();

/**
 * TODO 2
 *
 * 1. Get add device button with id #add-device
 * 2. Register credentials
 * 3. Verify registration
 * 3. Show credentials
 * */
const addDeviceButton = document.querySelector('#add-device');

addDeviceButton.addEventListener('click', async () => {
  try {
    const options = await getRegisterChallenge();

    await verifyRegistration(options);
    await showCredentials();
  } catch (error) {
    alert(error.message);
  }
});
