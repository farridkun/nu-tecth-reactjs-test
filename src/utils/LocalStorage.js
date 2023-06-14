export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const setAccessToken = (token) => {
  localStorage.setItem('access_token', token);
};

export const getName = () => {
  return localStorage.getItem('name');
};

export const setName = (name) => {
  if (!!getName()) {
    localStorage.removeItem('name');
  }
  localStorage.setItem('name', name);
};

export const removeDataStorage = () => {
  localStorage.clear();
}