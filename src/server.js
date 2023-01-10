import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import productsRouter from "./api/products/index.js";
import filesRouter from "./api/products/files.js";
import reviewsRouter from "./api/products/reviews/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
import createHttpError from "http-errors";

const server = express();

const port = process.env.PORT || 3001;

const publicFolderPath = join(process.cwd(), "./public");

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} --url ${req.url} -- ${new Date()}`);
  req.user = "Dan";
  next();
};

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

server.use(
  cors({
    origin: (origin, corsNext) => {
      console.log("Origin:", origin);
      if (!origin || whitelist.indexOf(origin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(createHttpError(400, `Cors error ${origin}`));
      }
    },
  })
);
server.use(express.static(publicFolderPath));
server.use(loggerMiddleware);
server.use(express.json());
server.use("/products", filesRouter);

server.use("/products", productsRouter);
server.use("/products", reviewsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port : ", port);
});
