import { MedServiceRepository } from "../db/index.js";
import ApiError from "../helpers/handleError.js";

export const saveService = async (req, res, next) => {
  try {
    const dbResponse = await new MedServiceRepository().saveService(req.body);

    return res.json(dbResponse);
  } catch (e) {
    if (e.name === "ValidationError" || e.code === "23502") {
      return next(ApiError.ValidationError("Validation failed"));
    }
    next(e);
  }
  next();
};

export const deleteService = async (req, res, next) => {
  try {
    const dbResponse = await new MedServiceRepository().deleteService(
      req.body.id
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

export const getServices = async (req, res, next) => {
  try {
    const dbResponse = await new MedServiceRepository().getServices(req.query);

    return res.json(dbResponse);
  } catch (e) {
    if (e.code === "22P02" || e.name === "CastError") {
      return next(ApiError.BadRequest("Invalid search string"));
    }
    next(e);
  }
  next();
};

export const getServiceById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const dbResponse = await new MedServiceRepository().getServiceById(_id);
    if (!dbResponse) {
      throw ApiError.NotFoundError("Requested service doesn't exist");
    }
    return res.json(dbResponse);
  } catch (e) {
    if (e.code === "22P02" || e.name === "CastError") {
      return next(ApiError.BadRequest("Invalid search string"));
    }
    next(e);
  }
  next();
};
