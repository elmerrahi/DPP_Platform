export function isAuthenticated() {
  return Boolean(localStorage.getItem('dpp_token'));
}
