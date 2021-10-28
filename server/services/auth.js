import { UserRepository } from "../db/index";
import { validationResult } from "express-validator";
import ApiError from "../helpers/handleError";
import { TOKEN_MAX_AGE } from "../constants";
import validateToken from "../helpers/validateToken";
import { TokenRepository } from "../db/index";
import generateToken from "../helpers/generateToken";

export const registerUser = async (req, res, next) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return next(
      ApiError.BadRequest("Validation error", errorsAfterValidation.array())
    );
  }
  try {
    const dbResponse = await new UserRepository().registerUser(req.body);
    if (dbResponse.userExist) {
      throw ApiError.AuthenticationError("User exists already");
    }
    res.cookie("refreshToken", dbResponse.tokens.refreshToken, {
      maxAge: TOKEN_MAX_AGE,
      httpOnly: true,
    });
    res.cookie("accessToken", dbResponse.tokens.accessToken, {
      maxAge: TOKEN_MAX_AGE,
      httpOnly: true,
    });
    return res.json(dbResponse);
  } catch (e) {
    next(e);
  }
  next();
};

export const loginUser = async (req, res, next) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return next(
      ApiError.BadRequest("Validation error", errorsAfterValidation.array())
    );
  }

  try {
    const dbResponse = await new UserRepository().loginUser(req.body);
    res.cookie("refreshToken", dbResponse.refreshToken, {
      maxAge: TOKEN_MAX_AGE,
      httpOnly: true,
    });
    res.cookie("accessToken", dbResponse.accessToken, {
      maxAge: TOKEN_MAX_AGE,
      httpOnly: true,
    });

    res.json(dbResponse);
    return;
  } catch (e) {
    next(e);
  }
  next();
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { _id } = req.body;
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const tokenKey = process.env.JWT_TOKEN_SECRET || "testing_key";
    const userInfo = validateToken(refreshToken, tokenKey);

    const tokenFromDb = await new TokenRepository().findToken(refreshToken);

    if (!userInfo || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await new UserRepository().findUser(_id);

    if (!user) {
      throw ApiError.NotFoundError("Requested user doesn't exist");
    }
    const email = user.email;
    const role = user.role;

    const tokens = generateToken({ email, _id, role });
    await new TokenRepository().saveToken(_id, tokens.refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: TOKEN_MAX_AGE,
      httpOnly: true,
    });
    res.cookie("accessToken", tokens.accessToken, {
      maxAge: TOKEN_MAX_AGE,
      httpOnly: true,
    });
    return res.json(tokens);
  } catch (e) {
    next(e);
  }
  next();
};
