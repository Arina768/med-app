import * as express from "express";
import ApiError from "../helpers/handleError";
import validateToken from "../helpers/validateToken";

export default function (req, res, next) {
  try {
    if (!req.cookies) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const tokenKey = process.env.JWT_TOKEN_SECRET || "testing_key";

    const userData = validateToken(accessToken, tokenKey);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.body.user = userData;

    next();
  } catch {
    return next(ApiError.UnauthorizedError());
  }
}
