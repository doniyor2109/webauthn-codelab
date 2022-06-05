/*
 * @license
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */

import * as api from './api.js';

export const getRegisterChallenge = async () => {
  const opts = {
    attestation: 'none',
    authenticatorSelection: {
      userVerification: 'preferred',
      requireResidentKey: false,
    },
  };
  return await api.getRegisterChallenge(opts);
};

export const verifyRegistration = async (options) => {
  options.user.id = base64url.decode(options.user.id);
  options.challenge = base64url.decode(options.challenge);

  if (options.excludeCredentials) {
    for (let cred of options.excludeCredentials) {
      cred.id = base64url.decode(cred.id);
    }
  }

  const credential = await navigator.credentials.create({
    publicKey: options,
  });
  const transports = credential.response.getTransports();

  const credentialPayload = {
    id: credential.id,
    transports,
    rawId: base64url.encode(credential.rawId),
    type: credential.type,
  };

  if (credential.response) {
    const clientDataJSON = base64url.encode(credential.response.clientDataJSON);
    const attestationObject = base64url.encode(
      credential.response.attestationObject
    );
    credentialPayload.response = {
      clientDataJSON,
      attestationObject,
    };
  }

  return await api.verifyRegistration(credentialPayload);
};

export const verifyLogin = async (options) => {
  if (options.allowCredentials.length === 0) {
    return new Error('No registered credentials found.');
  }

  options.challenge = base64url.decode(options.challenge);

  for (let cred of options.allowCredentials) {
    cred.id = base64url.decode(cred.id);
  }

  const cred = await navigator.credentials.get({
    publicKey: options,
  });

  const credential = {};
  credential.id = cred.id;
  credential.type = cred.type;
  credential.rawId = base64url.encode(cred.rawId);

  if (cred.response) {
    const clientDataJSON = base64url.encode(cred.response.clientDataJSON);
    const authenticatorData = base64url.encode(cred.response.authenticatorData);
    const signature = base64url.encode(cred.response.signature);
    const userHandle = base64url.encode(cred.response.userHandle);
    credential.response = {
      clientDataJSON,
      authenticatorData,
      signature,
      userHandle,
    };
  }

  return await api.verifyLogin(credential);
};

export async function showPublicKeyAuthentication() {
  if (!window.PublicKeyCredential) {
    return false;
  }

  try {
    const res = await api.getUserCredentials();
    if (res.credentials.length === 0) {
      return false;
    }
  } catch (error) {
    return false;
  }

  return true;
}
