import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const { BadRequest, NotFound } = createHttpError;

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "comment is a mandatory field and needs to be a string!",
    },
  },
  rate: {
    in: ["body"],
    isInt: {
      errorMessage: "rate is a mandatory field and needs to be a number!",
    },
    toInt: true,
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: "rate must be an integer between 1 and 5!",
    },
  },
};

export const checksReviewsSchema = checkSchema(reviewSchema);

export const triggerBadRequestRew = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    next(BadRequest({ errorList: errors.array() }));
  } else {
    next();
  }
};
