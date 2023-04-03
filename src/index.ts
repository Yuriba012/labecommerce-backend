import {
  users,
  products,
  purchases,
  createUser,
  getAllUsers,
  createProduct,
  createPurchase,
  getAllProducts,
  queryProductsByName,
  getProductById,
  getAllPurchasesFromUserId,
} from "./db";
import express, { Request, Response } from "express";
import { CATEGORY, TProduct, TUser } from "./types";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/products/search", (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const result = queryProductsByName(q);
    if (q.length < 2) {
      res.status(400);
      throw new Error("Busca deve possuir ao menos 2 caracteres");
    } else if (!result.length) {
      res.status(400);
      throw new Error("Nenhum item encontrado para sua busca");
    }
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);
    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.post("/users/createuser", (req: Request, res: Response) => {
  try {
    const id = JSON.stringify(Date.now());
    const email = req.body.email as string;
    const password = req.body.password as string;

    if (email === undefined) {
      res.status(400);
      throw new Error("propriedade 'email' não informada");
    }
    if (password === undefined) {
      res.status(400);
      throw new Error("propriedade 'password' não informada");
    }

    const repeatedEmail = users.find((user) => {
      user.email === email;
    });
    if (repeatedEmail !== undefined) {
      res.status(400);
      throw new Error("Email já cadastrado");
    }

    const newUser: TUser = {
      id,
      email,
      password,
    };
    users.push(newUser);

    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);
    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.post("/users/createproduct", (req: Request, res: Response) => {
  try {
    const id = JSON.stringify(Date.now());
    const name = req.body.name as string | undefined;
    const price = req.body.price as number | undefined;
    const category = req.body.category as CATEGORY | undefined;

    if (name === undefined) {
      res.status(400);
      throw new Error("propriedade 'name' não informada");
    }
    if (price === undefined) {
      res.status(400);
      throw new Error("propriedade 'price' não informada");
    }
    if (category === undefined) {
      res.status(400);
      throw new Error("propriedade 'category' não informada");
    } else if (
      category !== CATEGORY.BERMUDAS &&
      category !== CATEGORY.CAMISETAS &&
      category !== CATEGORY.CASACOS
    ) {
      throw new Error(
        "'category' informada não corresponde a um dos valores válidos"
      );
    }

    const newProduct: TProduct = {
      id,
      name,
      price,
      category,
    };
    products.push(newProduct);

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);
    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.post("/users/createpurchase", (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const productIds = req.body.productIds; // array de objetos => [{productId: id1, quantity}, {productId: id2, quantity}]

    const userExists = users.find((user)=>{
      return user.id === userId
    })
    if(!userExists){
      res.status(400)
      throw new Error("Id de usuário não existente")
    }
    for( let currentProduct of productIds){
      const productExists = products.find((thisProduct)=>thisProduct.id === currentProduct.productId)
      if(!productExists){
        throw new Error(`O produto de "id" = "  ${currentProduct.productId}" não existe`)
      }
    }

    createPurchase(userId, productIds);

    if (userId === undefined) {
      res.status(400);
      throw new Error("propriedade 'userId' não informada");
    }
    if (productIds === undefined) {
      res.status(400);
      throw new Error("propriedade 'productIds' não informada");
    }

    res.status(200).send(purchases);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);
    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.get("/purchases/:userId", (req: Request, res: Response)=>{
  try {
    const userId = req.params.userId;

    const userExists = users.find((user)=>{
      return user.id === userId
    })
    if(!userExists){
      res.status(400)
      throw new Error("Id de usuário não existente")
    }

    const foundPurchases = purchases.filter((purchase)=>purchase.userId === userId)

    res.status(200).send(foundPurchases);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.get("/products/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const foundProduct = getProductById(id);

    res.status(200).send(foundProduct);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.delete("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;

  const foundProductIndex = products.findIndex((product) => product.id === id);

  if (foundProductIndex >= 0) products.splice(foundProductIndex, 1);

  res.status(200).send("Produto deletado com sucesso!");
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const foundUserIndex = users.findIndex((user) => user.id === id);
  if (foundUserIndex >= 0) users.splice(foundUserIndex, 1);

  res.status(200).send("Usuário deletado com sucesso!");
});
app.delete("/purchases/:id", (req: Request, res: Response) => {
  try{
    const id = req.params.id as string;

    const purchaseExists = purchases.find((purchase)=>{
      return purchase.purchaseId === id
    })
    if(!purchaseExists){
      res.status(400)
      throw new Error("Id de compra não existente")
  }

  const foundPurchaseIndex = purchases.findIndex((purchase) => purchase.purchaseId === id);

  if (foundPurchaseIndex >= 0) purchases.splice(foundPurchaseIndex, 1);

  res.status(200).send("Compra deletada com sucesso!");
}catch(error){
  console.log(error);
  if (res.statusCode === 200) res.status(500);

  if (error instanceof Error) res.send(error.message);
  else res.send("Erro inesperado");
}
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const foundUserIndex = users.findIndex((user) => user.id === id);
  if (foundUserIndex >= 0) users.splice(foundUserIndex, 1);

  res.status(200).send("Usuário deletado com sucesso!");
});

app.put("/users/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const newEmail = req.body.email as string | undefined;
  const newPassword = req.body.password as string | undefined;

  const userToEdit = users.find((user) => user.id === id);

  if (userToEdit) {
    userToEdit.email = newEmail || userToEdit.email;
    userToEdit.password = newPassword || userToEdit.password;
  }

  res.status(200).send("Usuário modificado com sucesso");
});
app.put("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const newName = req.body.name as string | undefined;
  const newPrice = req.body.price as number | undefined;
  const newCategory = req.body.category as CATEGORY | undefined;

  const productToEdit = products.find((product) => product.id === id);

  if (productToEdit) {
    productToEdit.name = newName || productToEdit.name;
    productToEdit.price = newPrice || productToEdit.price;
    productToEdit.category = newCategory || productToEdit.category;
  }

  res.status(200).send("Usuário modificado com sucesso");
});

app.get("/users", (req: Request, res: Response) => {
  try {
    res.status(200).send(getAllUsers());
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.get("/products", (req: Request, res: Response) => {
  try {
    res.status(200).send(getAllProducts());
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});
