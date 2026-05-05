export function isAuthenticated() {
  return Boolean(localStorage.getItem('dpp_token'));
}

export function logout() {
  localStorage.removeItem('dpp_token');
  localStorage.removeItem('dpp_user');
}
