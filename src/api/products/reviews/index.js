import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
//import { checksReviewsSchema, triggerBadRequest } from "./validator.js";
import { writeProducts, getProducts } from "../../../lib/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;
const reviewsRouter = express.Router();
reviewsRouter.post(
  "/:productId/reviews",

  async (req, res, next) => {
    try {
      const productsArray = await getProducts();
      const index = productsArray.findIndex(
        (product) => product.id === req.params.productId
      );
      const newReview = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
        updatedAte: new Date(),
        productId: productsArray[index].id,
      };
      if (index !== -1) {
        const arrayReviews = productsArray[index].reviews;
        arrayReviews.push(newReview);
        await writeProducts(productsArray);
        res.status(201).send(newReview);
      } else {
        next(NotFound(`Product with id ${req.params.productId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.get(
  "/:productId/reviews",

  async (req, res, next) => {
    try {
      const productsArray = await getProducts();
      const index = productsArray.findIndex(
        (product) => product.id === req.params.productId
      );
      if (index !== -1) {
        res.send(productsArray[index].reviews);
      } else {
        next(NotFound(`Product with id ${req.params.productId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.get(
  "/:productId/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const productsArray = await getProducts();
      const index = productsArray.findIndex(
        (product) => product.id === req.params.productId
      );
      if (index !== -1) {
        const singleReview = productsArray[index].reviews.find(
          (review) => review.id === req.params.reviewId
        );
        if (singleReview) {
          res.send(singleReview);
        } else {
          next(NotFound(`Review with id ${req.params.reviewId} not found!`));
        }
      } else {
        next(NotFound(`Product with id ${req.params.productId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.put(
  "/:productId/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const productsArray = await getProducts();
      const index = productsArray.findIndex(
        (product) => product.id === req.params.productId
      );

      if (index !== -1) {
        const ind = productsArray[index].reviews.findIndex(
          (review) => review.id === req.params.reviewId
        );

        const oldReview = productsArray[index].reviews[ind];
        console.log("this is the old review", oldReview);
        const updateReview = {
          ...oldReview,
          ...req.body,
          updatedAt: new Date(),
        };
        if (ind !== -1) {
          productsArray[index].reviews[ind] = updateReview;
          await writeProducts(productsArray);
          res.send(updateReview);
        } else {
          next(NotFound(`Review with id ${req.params.reviewId} not found!`));
        }
      } else {
        next(NotFound(`Product with id ${req.params.productId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.delete(
  "/:productId/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const productsArray = await getProducts();
      const index = productsArray.findIndex(
        (product) => product.id === req.params.productId
      );

      if (index !== -1) {
        const ind = productsArray[index].reviews.findIndex(
          (product) => product.id === req.params.reviewId
        );
        if (ind !== -1) {
          productsArray[index].reviews = productsArray[index].reviews.filter(
            (review) => review.id !== req.params.reviewId
          );
          await writeProducts(productsArray);
          res.status(204).send();
        } else {
          next(NotFound(`Review with id ${req.params.reviewId} not found!`));
        }
      } else {
        next(NotFound(`Product with id ${req.params.productId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
