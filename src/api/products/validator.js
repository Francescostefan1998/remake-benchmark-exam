import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const { BadRequest, NotFound } = createHttpError;
/* 
{
        "_id": "5d318e1a8541744830bef139", //SERVER GENERATED
        "name": "3310",  //REQUIRED
        "description": "somthing longer", //REQUIRED
        "brand": "nokia", //REQUIRED 	  
        "imageUrl":"https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80",
        "price": 100, //REQUIRED
        "category": "smartphones" //REQUIRED
        "createdAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED
        "updatedAt": "2019-07-19T09:32:10.535Z", //SERVER GENERATED
    }
*/
const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a string!",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is a mandatory field and needs to be a string!",
    },
  },
  price: {
    in: ["body"],
    isInt: {
      errorMessage: "price is a mandatory field and needs to be a number!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "category is a mandatory field and needs to be a string!",
    },
  },
};

export const checksProductsSchema = checkSchema(productSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    next(
      BadRequest({
        errorList: errors.array(),
      })
    );
  } else {
    next();
  }
};
