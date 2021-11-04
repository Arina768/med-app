import ApiError from "../helpers/handleError.js";
import validateToken from "../helpers/validateToken.js";

export default function (req, res, next) {
  try {
    if (!req.cookies) {
      return next(ApiError.UnauthorizedError("no cookie"));
    }

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next(ApiError.UnauthorizedError("no access token"));
    }
    const tokenKey = process.env.JWT_TOKEN_SECRET || "testing_key";

    const userData = validateToken(accessToken, tokenKey);
    console.log("userData", accessToken, tokenKey, userData, req.cookies);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.body.user = userData;

    next();
  } catch {
    return next(ApiError.UnauthorizedError());
  }
}
