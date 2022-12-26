import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import productsRouter from "./api/products/index.js";
import filesRouter from "./api/products/files.js";

import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";

const server = express();

const port = 3001;

const publicFolderPath = join(process.cwd(), "./public");

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} --url ${req.url} -- ${new Date()}`);
  req.user = "Dan";
  next();
};

server.use(express.static(publicFolderPath));
server.use(cors());
server.use(loggerMiddleware);
server.use(express.json());
server.use("/products", filesRouter);

server.use("/products", productsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port : ", port);
});
