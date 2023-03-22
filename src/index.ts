import {
  users,
  products,
  purchase,
  createUser,
  getAllUsers,
  createProduct,
  createPurchase,
  getAllProducts,
  queryProductsByName,
  getProductById,
  getAllPurchasesFromUserId
} from "./db";
import { CATEGORY } from "./types";

createProduct("46437", "camisa", 654, CATEGORY.CAMISETAS);

console.log(getProductById("2356"));

console.log(queryProductsByName("sport"));

createPurchase("1", "987", 3, 300);
createPurchase("1", "8423", 6, 556);

console.log(getAllPurchasesFromUserId("2"))