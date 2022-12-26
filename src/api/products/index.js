import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checksProductsSchema, triggerBadRequest } from "./validator.js";
//import filesRouter from "./files.js";
import multer from "multer";
import { extname } from "path";
import {
  saveProductsAvatar,
  getProducts,
  writeProducts,
} from "../../lib/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const productsRouter = express.Router();

productsRouter.post(
  "/",

  checksProductsSchema,
  triggerBadRequest,

  async (req, res, next) => {
    try {
      const newProduct = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
        reviews: [],
        imageUrl: "",
      };
      const productsArray = await getProducts();
      productsArray.push(newProduct);
      await writeProducts(productsArray);
      res.status(201).send({ id: newProduct.id });
    } catch (error) {
      next(error);
    }
  }
);
productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    console.log(productsArray);
    if (req.query && req.query.category) {
      const filteredProducts = productsArray.filter(
        (product) => product.category === req.query.category
      );
      res.send(filteredProducts);
    } else {
      res.send(productsArray);
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const findProduct = productsArray.find(
      (product) => product.id === req.params.productId
    );
    if (findProduct) {
      res.send(findProduct);
    } else {
      next(NotFound(`Product with id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const index = productsArray.findIndex(
      (product) => product.id === req.params.productId
    );
    if (index !== -1) {
      const oldProduct = productsArray[index];
      const updateProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date(),
      };
      productsArray[index] = updateProduct;
      await writeProducts(productsArray);
      res.send(productsArray);
    } else {
      next(NotFound(`Product with id ${req.params.productkId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const index = productsArray.findIndex(
      (product) => product.id === req.params.productId
    );
    const remainingProducts = productsArray.filter(
      (product) => product.id !== req.params.productId
    );
    if (index !== -1) {
      await writeProducts(remainingProducts);
      res.status(204).send();
    } else {
      next(NotFound(`Product with id ${req.params.productkId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
