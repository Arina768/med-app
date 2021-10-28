import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  const tokenKey = process.env.JWT_TOKEN_SECRET || "testing_key";
  const accessToken = jwt.sign(payload, tokenKey, {
    expiresIn: 10000,
  });
  const refreshToken = jwt.sign(payload, tokenKey, {
    expiresIn: 1000000000,
  });

  return { accessToken, refreshToken };
};

export default generateToken;
