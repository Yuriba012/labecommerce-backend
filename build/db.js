"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.queryProductsByName = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchase = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [
    {
        id: "1",
        email: "fulaninho@hotmail.com",
        password: "123123",
    },
    {
        id: "2",
        email: "cicrano@hotmail.com",
        password: "321654",
    },
];
exports.products = [
    {
        id: "123",
        name: "camiseta astronauta",
        price: 49.99,
        category: types_1.CATEGORY.CAMISETAS,
    },
    {
        id: "987",
        name: "bermuda sport",
        price: 69.9,
        category: types_1.CATEGORY.BERMUDAS,
    },
    {
        id: "2356",
        name: "Casaco Adidas Sport",
        price: 179.99,
        category: types_1.CATEGORY.CASACOS,
    },
];
exports.purchase = [
    {
        userId: "2",
        productId: "987",
        quantity: 2,
        totalPrice: 139.8,
    }
];
function createUser(id, email, password) {
    const newUser = {
        id: id,
        email: email,
        password: password,
    };
    exports.users.push(newUser);
    console.log("Cadastro realizado com sucesso");
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function createProduct(id, name, price, category) {
    const newProduct = {
        id: id,
        name: name,
        price: price,
        category: category,
    };
    exports.products.push(newProduct);
    console.log("Produto cadastrado com sucesso");
}
exports.createProduct = createProduct;
function getAllProducts() {
    return exports.products;
}
exports.getAllProducts = getAllProducts;
function getProductById(id) {
    return exports.products.find((product) => product.id === id);
}
exports.getProductById = getProductById;
function queryProductsByName(query) {
    return exports.products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
}
exports.queryProductsByName = queryProductsByName;
function createPurchase(userId, productId, quantity, totalPrice) {
    const newPurchase = {
        userId: userId,
        productId: productId,
        quantity: quantity,
        totalPrice: totalPrice,
    };
    exports.purchase.push(newPurchase);
    console.log("Compra realizada com sucesso");
}
exports.createPurchase = createPurchase;
;
function getAllPurchasesFromUserId(userId) {
    return exports.purchase.filter((purchase) => (purchase.userId === userId));
}
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
//# sourceMappingURL=db.js.map