import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveProductsAvatar,
  getProducts,
  writeProducts,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:productId/single",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.productId + originalFileExtension;

      await saveProductsAvatar(fileName, req.file.buffer);
      const url = `http://localhost:3001/img/products/${fileName}`;
      console.log(url);
      const products = await getProducts();
      const index = products.findIndex(
        (product) => product.id === req.params.productId
      );
      if (index !== -1) {
        const oldProduct = products[index];
        /*const pictures = {
          imageUrl: url,
        };

        const pictures = {
          ...oldProduct.pictures,

          imageUrl: url,
        };*/

        const updateProduct = {
          ...oldProduct,
          imageUrl: url,
          updatedAt: new Date(),
        };

        products[index] = updateProduct;
        await writeProducts(products);
        res.send("file uploaded in the proper field");
      } else {
        res.send("File upload !");
      }
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/multiple",
  multer().array("avatars"),
  async (req, res, next) => {
    try {
      console.log("Files: ", req.files);
      await Promise.all(
        req.files.map((file) =>
          saveProductsAvatar(file.originalname, file.buffer)
        )
      );
      res.send(" files uploaded ");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
