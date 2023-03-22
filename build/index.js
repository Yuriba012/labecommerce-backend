"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const types_1 = require("./types");
(0, db_1.createProduct)("46437", "camisa", 654, types_1.CATEGORY.CAMISETAS);
console.log((0, db_1.getProductById)("2356"));
console.log((0, db_1.queryProductsByName)("sport"));
(0, db_1.createPurchase)("1", "987", 3, 300);
(0, db_1.createPurchase)("1", "8423", 6, 556);
console.log((0, db_1.getAllPurchasesFromUserId)("2"));
//# sourceMappingURL=index.js.map