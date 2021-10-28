import ApiError from "../helpers/handleError";

export default function (req, res, next) {
  const userRole = req.body.user.role;

  if (userRole !== "user") {
    return next(ApiError.AuthenticationError("You don't have user privileges"));
  }
  next();
}
