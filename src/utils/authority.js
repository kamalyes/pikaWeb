import {reloadAuthorized} from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority(str) {
  // authorityString could be admin, "admin", ["admin"]
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('PikaAuthority') : str;

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('PikaAuthority', JSON.stringify(proAuthority)); // auto reload
  reloadAuthorized();
}
