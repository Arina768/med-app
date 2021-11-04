import ApiError from "../helpers/handleError.js";

export default function (error, req, res, next) {
  console.log(error);

  if (error instanceof ApiError) {
    return res
      .status(error.code)
      .json({ message: error.message, errors: error.errors });
  }
  return res.status(500).json({ message: "Something failed!" });
}
