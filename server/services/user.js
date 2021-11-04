import { UserRepository } from "../db/index.js";
import ApiError from "../helpers/handleError.js";

export const findUser = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const dbResponse = await new UserRepository().findUser(_id);
    if (!dbResponse) {
      throw ApiError.AuthenticationError("requested user doesn't exist");
    }
    return res.json(dbResponse);
  } catch (e) {
    next(e);
  }
  next();
};

export const updateProfile = async (req, res, next) => {
  try {
    const dbResponse = await new UserRepository().updateProfile(req.body);

    return res.json(dbResponse);
  } catch (e) {
    next(e);
  }
  next();
};
export const updatePassword = async (req, res, next) => {
  try {
    const dbResponse = await new UserRepository().updatePassword(req.body);
    if (!dbResponse) {
      throw ApiError.AuthenticationError("requested user doesn't exist");
    }

    return res.json(dbResponse);
  } catch (e) {
    next(e);
  }
  next();
};

export const getAllServices = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const dbResponse = await new UserRepository().getAllServices(_id);
    if (!dbResponse) {
      throw ApiError.AuthenticationError("requested user doesn't exist");
    }
    return res.json(dbResponse);
  } catch (e) {
    next(e);
  }
  next();
};

export const addNewService = async (req, res, next) => {
  try {
    const dbResponse = await new UserRepository().addNewService(req.body);
    return res.json(dbResponse);
  } catch (e) {
    if (e.name === "ValidationError" || e.code === "23502") {
      return next(ApiError.ValidationError("Validation failed"));
    }
    next(e);
  }
  next();
};

export const addBasicServices = async (req, res, next) => {
  try {
    const dbResponse = await new UserRepository().addBasicServices(req.body);
    return res.json(dbResponse);
  } catch (e) {
    if (e.name === "ValidationError" || e.code === "23502") {
      return next(ApiError.ValidationError("Validation failed"));
    }
    next(e);
  }
  next();
};

export const modifyAppointment = async (req, res, next) => {
  try {
    const dbResponse = await new UserRepository().modifyAppointment(
      req.body,
      req.method
    );
    return res.json(dbResponse);
  } catch (e) {
    if (e.name === "ValidationError" || e.code === "23502") {
      return next(ApiError.ValidationError("Validation failed"));
    }
    next(e);
  }
  next();
};
