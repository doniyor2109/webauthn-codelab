import {
  getUserCredentials,
  registerCredential,
  unregisterCredential,
} from '/js/utils.js';
import {
  html,
  render,
} from 'https://unpkg.com/lit-html@1.0.0/lit-html.js?module';

const register = document.querySelector('#register');

if (window.PublicKeyCredential) {
  PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
    (uvpaa) => {
      if (uvpaa) {
        register.classList.remove('hidden');
      } else {
        document.querySelector('#uvpa_unavailable').classList.remove('hidden');
      }
    }
  );
} else {
  document.querySelector('#uvpa_unavailable').classList.remove('hidden');
}

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

const getCredentials = async () => {
  const { credentials } = await getUserCredentials();
  const list = document.querySelector('#list');

  if (credentials.length > 0) {
    const content = html`${credentials.map(renderCredentialItem)}`;
    render(content, list);
  } else {
    render(html`<p>No credentials found.</p>`, list);
  }
};

const removeCredential = async (event) => {
  try {
    await unregisterCredential(event.target.id);
    await getCredentials();
  } catch (error) {
    alert(error.message);
  }
};

register.addEventListener('click', async () => {
  try {
    await registerCredential();
    await getCredentials();
  } catch (error) {
    alert(error.message);
  }
});

getCredentials();
