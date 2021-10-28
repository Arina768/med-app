export const getExpirationDate = (jwtToken) => {
  const jwt = JSON.parse(atob(jwtToken.split(".")[1]));

  return jwt && jwt.exp && jwt.exp * 1000;
};

export const isExpired = (expDate) => {
  if (!expDate) {
    return false;
  }

  return Date.now() > Number(expDate);
};
