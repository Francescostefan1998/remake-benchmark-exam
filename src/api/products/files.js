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
    const products = await getProducts();
    const index = products.findIndex(
      (product) => product.id === req.params.productId
    );
    console.log("REQ FILE: ", req.file);
    const oldProduct = products[index];
    const url =
      "https://res.cloudinary.com/dkyzwols6/image/upload/v1673463061/" +
      req.file.filename +
      req.file.originalname;
    console.log(url);
    const updateProduct = {
      ...oldProduct,
      imageUrl: req.file.path,
      updatedAt: new Date(),
    };
    products[index] = updateProduct;

    await writeProducts(products);
    res.send("file uploaded in the proper field");
    // 1. upload on Cloudinary happens automatically
    // 2. req.file contains the path which is the url where to find that picture
    // 3. update the resource by adding the path to it
  } catch (error) {
    next(error);
  }
});
filesRouter.post("/1", cloudUploder, async (req, res, next) => {
  console.log(req.file);
  try {
    const originalFileExtension = extname(req.file.originalname);
    const fileName = req.params.productId + originalFileExtension;
    console.log(req.file);
    await saveProductsAvatar(fileName, req.file.buffer);
    const url = `https://res.cloudinary.com/dkyzwols6/image/upload/v1673460333/fs0422/users/${fileName}`;
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
