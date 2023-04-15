import { queryProductsByName } from "./function";
import express, { Request, Response } from "express";
import { TProduct, TPurchase, TUser } from "./types";
import cors from "cors";
import { db } from "./database/knex";

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

//Pesquisar produtos pelo nome ou parte do nome.
app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const result = await queryProductsByName(q);
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

//Criar um novo usuário
app.post("/users/createuser", async (req: Request, res: Response) => {
  try {
    const id = JSON.stringify(Date.now());
    const name = req.body.name as string;
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

    await db.raw(`
      INSERT INTO users(id, name, email, password)
      VALUES("${id}", "${name}", "${email}", "${password}");
    `);

    res.status(201).send("Usuário cadastrado");
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);
    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

//Criar novo produto.
app.post("/users/createproduct", async (req: Request, res: Response) => {
  try {
    const id = JSON.stringify(Date.now());
    const name = req.body.name as string | undefined;
    const price = req.body.price as number | undefined;
    const description = req.body.description as string | undefined;
    const imageUrl = req.body.imageUrl as string | undefined;

    if (name === undefined) {
      res.status(400);
      throw new Error("propriedade 'name' não informada");
    }
    if (price === undefined) {
      res.status(400);
      throw new Error("propriedade 'price' não informada");
    }
    if (description === undefined) {
      res.status(400);
      throw new Error("propriedade 'description' não informada");
    }
    if (imageUrl === undefined) {
      res.status(400);
      throw new Error("propriedade 'imageUrl' não informada");
    }

    await db.raw(`
      INSERT INTO products(id, name, price, description, imageUrl)
      VALUES("${id}", "${name}", "${price}", "${description}", "${imageUrl}")
    `);

    res.status(201).send("Produto cadastrado com sucesso");
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);
    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

//Criar nova compra.
app.post("/users/createpurchase", async (req: Request, res: Response) => {
  try {
    const users = (await db.select("*").from("users")) as TUser[];
    const id = JSON.stringify(Date.now());
    let totalPrice = 0;
    const paid = 0;
    const deliveredAt = null;
    const buyerId = req.body.buyerId;

    const userExists = users.find((user) => {
      return user.id === buyerId;
    });
    if (!userExists) {
      res.status(400);
      throw new Error("Id de usuário não existente");
    }

    if (buyerId === undefined) {
      res.status(400);
      throw new Error("propriedade 'buyerId' não informada");
    } else if (totalPrice === undefined) {
      res.status(400);
      throw new Error("propriedade 'totalPrice' não informada");
    }

    const purchaseProducts = req.body.products; //Array de produtos da compra com id e quantidade;

    for (let product of purchaseProducts) {
      if (typeof product.id !== "string") {
        res.status(400);
        throw new Error(
          `o id do produto inserido (id = ${product.id}) não é uma string.`
        );
      } else if (typeof product.quantity !== "number") {
        res.status(400);
        throw new Error(
          `o produto de id = ${product.id} deve possuir uma quantidade numérica.`
        );
      } else if (product.quantity <= 0) {
        res.status(400);
        throw new Error(
          `o produto de id = ${product.id} deve possuir uma quantidade maior do que ZERO.`
        );
      }

      const [productInDataBase]: TProduct[] = await db("products").where({
        id: product.id,
      });

      if (!productInDataBase) {
        res.status(404);
        throw new Error(`o produto de id = ${product.id} não existe.`);
      }

      totalPrice += productInDataBase.price * product.quantity;
    }

    const newPurchase = {
      id: id,
      total_price: totalPrice.toFixed(2),
      paid: paid,
      delivered_at: deliveredAt,
      buyer_id: buyerId,
    };

    await db("purchases").insert(newPurchase);

    for (let product of purchaseProducts) {
      const newPurchaseProduct = {
        purchase_id: id,
        product_id: product.id,
        quantity: product.quantity,
      };
      await db("purchases_products").insert(newPurchaseProduct);
    }
    res.status(200).send("Compra realizada com sucesso.");

  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);
    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const [purchase]: TPurchase[] = await db("purchases").where({ id: id });

    if (!purchase) {
      res.status(400);
      throw new Error("Id de compra não existente");
    }

    await db("purchases").del().where({ id: id });

    res.status(200).send("Compra deletada com sucesso!");
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const [product]: TProduct[] = await db("products").where({ id: id });

    const newName = req.body.name as string | undefined;
    const newPrice = req.body.price as number | undefined;
    const newDescription = req.body.description as string | undefined;
    const newImageUrl = req.body.imageUrl as string | undefined;

    if (newName !== undefined) {
      if (typeof newName !== "string") {
        res.status(400);
        throw new Error("'name' deve ser string");
      }

      if (newName.length < 2) {
        res.status(400);
        throw new Error("'name' deve possuir no mínimo 2 caracteres");
      }
    }
    if (newDescription !== undefined) {
      if (typeof newDescription !== "string") {
        res.status(400);
        throw new Error("'description' deve ser string");
      }

      if (newDescription.length < 2) {
        res.status(400);
        throw new Error("'description' deve possuir no mínimo 2 caracteres");
      }
    }
    if (newImageUrl !== undefined) {
      if (typeof newImageUrl !== "string") {
        res.status(400);
        throw new Error("'imageUrl' deve ser string");
      }

      if (newImageUrl.length < 2) {
        res.status(400);
        throw new Error("'imageUrl' deve possuir no mínimo 2 caracteres");
      }
    }

    if (newPrice !== undefined) {
      if (typeof newPrice !== "number") {
        res.status(400);
        throw new Error("'price' deve ser number");
      }
    }

    if (product) {
      const newProduct: TProduct = {
        id: product.id,
        name: newName || product.name,
        price: newPrice || product.price,
        description: newDescription || product.description,
        imageUrl: newImageUrl || product.imageUrl,
      };
      await db("products").update(newProduct).where({ id: id });
    } else {
      res.status(404);
      throw new Error(
        "Id informado não corresponde à nenhum produto cadastrado."
      );
    }

    res.status(200).send("Produto modificado com sucesso");
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);
    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select("id","name","email", "created_at").from("users");
    console.log(allUsers);
    res.status(200).send(allUsers);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});
app.get("/purchases", async (req: Request, res: Response) => {
  try {
    const allPurchases = await db.select("*").from("purchases");
    res.status(200).send(allPurchases);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const allProducts = await db.raw(`SELECT * FROM products`);

    res.status(200).send(allProducts);
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
});

app.get("/purchases/:id", async (req: Request, res: Response)=>{
  try {
    const id = req.params.id as string;

    if(typeof id !== "string"){
      res.status(400)
      throw new Error("id deve ser do tipo string.")
    }

    const [purchase]: TPurchase[] = await db("purchases").where({id: id})

    if(!purchase){
      res.status(404)
      throw new Error("Id não encontrado.")
    }

    res.status(201).send(purchase);
    
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
})

app.get("/userpurchases/:id", async (req: Request, res: Response)=>{
  try {
    const id = req.params.id as string;

    if(typeof id !== "string"){
      res.status(400)
      throw new Error("id deve ser do tipo string.")
    }

    const purchases = await db.raw(`
      SELECT 
      purchases.buyer_id AS UserID,
      users.name AS UserName,
      purchases.id AS PurchaseID,
      purchases.total_price AS totalPrice,
      products.id AS ProductID,
      purchases_products.quantity AS Quantity,
      products.name AS ProductName
      FROM purchases
      INNER JOIN purchases_products
      ON purchases_products.purchase_id = purchases.id
      INNER JOIN products
      ON purchases_products.product_id = products.id
      INNER JOIN users
      ON purchases.buyer_id = users.id
      WHERE users.id = "${id}"
    `)

    if(!purchases){
      res.status(404)
      throw new Error("Id não encontrado.")
    }

    res.status(201).send(purchases);
    
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) res.status(500);

    if (error instanceof Error) res.send(error.message);
    else res.send("Erro inesperado");
  }
})
