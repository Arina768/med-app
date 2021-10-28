import jwt from "jsonwebtoken";

const validateToken = (token, key) => {
  try {
    const userInfo = jwt.verify(token, key);
    return userInfo;
  } catch (e) {
    return null;
  }
};

export default validateToken;
