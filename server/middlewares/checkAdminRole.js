import * as express from "express";
import ApiError from "../helpers/handleError";

export default function (req, res, next) {
  const userRole = req.body.user.role;
  if (userRole !== "admin") {
    return next(
      ApiError.AuthenticationError("You don't have admin privileges")
    );
  }
  next();
}
