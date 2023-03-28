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
  getAllPurchasesFromUserId,
} from "./db";
import express, { Request, Response } from "express";
import { CATEGORY, TProduct } from "./types";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/products/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const foundProduct = getProductById(id);

  console.log(foundProduct);
  res.status(200).send(foundProduct);
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

app.put("/users/:id", (req: Request, res: Response)=>{
  const id = req.params.id;

  const newEmail = req.body.email as string | undefined;
  const newPassword = req.body.password as string | undefined;

  const userToEdit = users.find((user)=>user.id === id)

  if (userToEdit){
    userToEdit.email = newEmail || userToEdit.email
    userToEdit.password = newPassword || userToEdit.password
  }


  res.status(200).send("Usuário modificado com sucesso")
})
app.put("/products/:id", (req: Request, res: Response)=>{
  const id = req.params.id;

  const newName = req.body.name as string | undefined;
  const newPrice = req.body.price as number | undefined;
  const newCategory = req.body.category as CATEGORY | undefined;

  const productToEdit = products.find((product)=>product.id === id)

  if (productToEdit){
    productToEdit.name = newName || productToEdit.name
    productToEdit.price = newPrice || productToEdit.price
    productToEdit.category = newCategory || productToEdit.category
  }


  res.status(200).send("Usuário modificado com sucesso")
})

app.get("/users", (req: Request, res: Response) => {
  res.status(200).send(getAllUsers());
});

app.get("/products", (req: Request, res: Response) => {
  res.status(200).send(getAllProducts());
});

// app.get("/products/search", (req: Request, res: Response)=>{
//   const q = req.query.q as string
//   res.status(200).send(queryProductsByName(q));

// })
