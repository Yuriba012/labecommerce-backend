import { TUser, TProduct, TPurchase, CATEGORY } from "./types";

export const users: TUser[] = [
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

export const products: TProduct[] = [
  {
    id: "a1",
    name: "camiseta astronauta",
    price: 49.99,
    category: CATEGORY.CAMISETAS,
  },
  {
    id: "a2",
    name: "bermuda sport",
    price: 69.9,
    category: CATEGORY.BERMUDAS,
  },
  {
    id: "a3",
    name: "Casaco Adidas Sport",
    price: 179.99,
    category: CATEGORY.CASACOS,
  },
];

export const purchase: TPurchase[] = [
  {
    userId: "2",
    productId: "987",
    quantity: 2,
    totalPrice: 139.8,
  }
];

export function createUser(id: string, email: string, password: string): void {
  const newUser: TUser = {
    id: id,
    email: email,
    password: password,
  };
  users.push(newUser);
  console.log("Cadastro realizado com sucesso");
}

export function getAllUsers(): TUser[] {
  return users;
}

export function createProduct(
  id: string,
  name: string,
  price: number,
  category: CATEGORY
): void {
  const newProduct: TProduct = {
    id: id,
    name: name,
    price: price,
    category: category,
  };
  products.push(newProduct);
  console.log("Produto cadastrado com sucesso");
}

export function getAllProducts() {
  return products;
}

export function getProductById(id: string) {
  return products.find((product: TProduct) => product.id === id);
}

export function queryProductsByName(query: string):TProduct[] {
  return products.filter((product: TProduct) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
}

export function createPurchase(
  userId: string,
  productId: string,
  quantity: number,
  totalPrice: number
): void {
  const newPurchase: TPurchase = {
    userId: userId,
    productId: productId,
    quantity: quantity,
    totalPrice: totalPrice,
  };
  purchase.push(newPurchase)
  console.log("Compra realizada com sucesso")
};

export function getAllPurchasesFromUserId(userId: string): TPurchase[] {
    return purchase.filter((purchase: TPurchase)=>(purchase.userId === userId))
}
