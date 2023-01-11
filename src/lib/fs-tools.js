import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import { Console } from "console";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");

const publicFolderPath = join(process.cwd(), "./public/img/products");

console.log("Root of the project: ", process.cwd());
console.log("Public folder : ", publicFolderPath);
console.log("Data folder path: ", dataFolderPath);

const productsJSONPath = join(dataFolderPath, "products.json");
console.log("product json PATH: ", productsJSONPath);
export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPath, productsArray);

export const saveProductsAvatar = (fileName, conteAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), conteAsABuffer);
export const getProductsJSONReadableStream = () =>
  createReadStream(productsJSONPath);
