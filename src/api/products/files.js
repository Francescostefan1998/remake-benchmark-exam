import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveProductsAvatar,
  getProducts,
  writeProducts,
} from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getProductsJSONReadableStream } from "../../lib/fs-tools.js";
import { pipeline } from "stream"; //
import { createGzip } from "zlib";
import PdfPrinter from "pdfmake";
const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const docDefinition = {
  content: [
    "First Product",
    "Another product, thismmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
    "Another product, this longer",
    "First Product",
  ],
};

const printer = new PdfPrinter(fonts);
const pdfReadableStream = printer.createPdfKitDocument(docDefinition);

pdfReadableStream.end();

const filesRouter = express.Router();

const cloudUploder = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "fs0422/users",
    },
  }),
}).single("avatar");

filesRouter.post("/:productId", cloudUploder, async (req, res, next) => {
  try {
    const originalFileExtension = extname(req.file.originalname);
    const fileName = req.params.productId + originalFileExtension;
    console.log(req.file);
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
});

filesRouter.post(
  "/:productId/multiple",
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

filesRouter.get("/productsJSON", (req, res, next) => {
  try {
    // SOURCES (file on disk, http request,...) --> DESTINATIONS (file on disk, terminal, http response)

    // SOURCE (Readable Stream on books.json file) --> DESTINATION (http response)

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products.json.gz"
    );
    const source = getProductsJSONReadableStream();
    const destination = res;
    const transform = createGzip();
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});
filesRouter.get("/productsPDF", (req, res, next) => {
  try {
    // SOURCES (file on disk, http request,...) --> DESTINATIONS (file on disk, terminal, http response)

    // SOURCE (Readable Stream on books.json file) --> DESTINATION (http response)

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products3.json.pdf"
    );
    const source = pdfReadableStream;
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
