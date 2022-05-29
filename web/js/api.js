/** @function base64url */

export const _fetch = async (path, payload = '') => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (payload && !(payload instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(payload);
  }
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers,
    body: payload,
  });
  if (res.status === 200) {
    // Server authentication succeeded
    return res.json();
  } else {
    // Server authentication failed
    const result = await res.json();
    throw new Error(result.error);
  }
};

export const getRegisterChallenge = (opts) => {
  return _fetch('/auth/registerRequest', opts);
};

export const verifyRegistration = (payload) => {
  return _fetch('/auth/registerResponse', payload);
};

export const unregisterCredential = (credId) => {
  return _fetch(`/auth/removeKey?credId=${encodeURIComponent(credId)}`);
};

export const getUserCredentials = () => {
  return _fetch('/auth/getKeys');
};

export const loginWithPassword = (values) => {
  return _fetch('/auth/password', values);
};

export const sendUsername = (values) => {
  return _fetch('/auth/username', values);
};

export const getLoginChallenge = () => {
  return _fetch('/auth/signinRequest', {});
};

export const verifyLogin = (credential) => {
  return _fetch(`/auth/signinResponse`, credential);
};
