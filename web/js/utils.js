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

import {
  verifyLogin,
  getLoginChallenge,
  getRegisterChallenge,
  verifyRegistration,
} from './api.js';

export const registerCredential = async () => {
  const opts = {
    attestation: 'none',
    authenticatorSelection: {
      // authenticatorAttachment: "cross-platform",
      userVerification: 'prefered',
      requireResidentKey: false,
    },
  };
  const options = await getRegisterChallenge(opts);

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

  return await verifyRegistration(credentialPayload);
};

export const authenticate = async () => {
  const options = await getLoginChallenge();

  if (options.allowCredentials.length === 0) {
    console.info('No registered credentials found.');
    return Promise.resolve(null);
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

  return await verifyLogin(credential);
};
