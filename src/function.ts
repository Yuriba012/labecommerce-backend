import { db } from "./database/knex";
import { TUser, TProduct, TPurchase, CATEGORY } from "./types";

export function queryProductsByName(query: string): TProduct[] {
  const products = db.raw(`SELECT * FROM products
  WHERE name LIKE "%${query}%"
  `) as any
  return products;
}