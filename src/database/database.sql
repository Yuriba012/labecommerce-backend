-- Active: 1680540648917@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME())
);

DROP TABLE users;

INSERT INTO users (id,name, email, password)
VALUES
("1561845146", "Usuario_1", "usuario1@hotmail.com","123123"),
("2566419846","Usuario_2", "usuario2@hotmail.com", "321654"),
("6846541894", "Usuario_3", "usuario3@gmail.com", "95143647");

CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    imageUrl TEXT NOT NULL
);

DROP TABLE products;

INSERT INTO products(id, name, price, description, imageUrl)
VALUES
("6465164165", "camiseta astronauta", 49.99, "descriçãodescriçãodescriçãodescriçãodescrição", "www.url.com/1"),
("1651321664", "bermuda sport", 69.9, "descriçãodescriçãodescriçãodescriçãodescriçãodescriçã", "www.url.com/2"),
("8584512184", "Casaco Adidas Sport", 179.99, "descriçãodescriçãodescriçãodescriçãodescrição", "www.url.com/3"),
("2014842010", "Camiseta keep calm preta", 59.90, "descriçãodescriçãodescriçãodescriçãodescrição", "www.url.com/4"),
("3465897512", "Casaco couro marrom", 195.90, "descriçãodescriçãodescriçãodescriçãodescrição", "www.url.com/5");

--GetAllUsers
SELECT * FROM users;

-- GetAllProducts
SELECT * FROM products;

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);
DROP TABLE purchases;
INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES 
    ("p001", 247.50, 0, "1"),
    ("p002", 189.49, 0, "1"),
    ("p003", 59.90, 0, "3"),
    ("p004", 61.90, 0, "3");

SELECT * FROM purchases;

UPDATE purchases
SET delivered_at = date('now')
WHERE id = "p004";

SELECT 
    purchases.id AS purchase_id,
    purchases.total_price,
    purchases.delivered_at,
    purchases.buyer_id,
    users.email AS buyer_email
FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE buyer_id = "3"
ORDER BY delivered_at ASC;

CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

SELECT * FROM purchases_products;
DROP TABLE purchases_products;

INSERT INTO purchases_products(purchase_id, product_id, quantity)
VALUES
    ("p001", "a3", 3),
    ("p001", "a4", 1),
    ("p003", "a1", 2),
    ("p003", "a2", 1),
    ("p002", "a1", 2);

SELECT 
purchases.buyer_id AS UserID,
users.name AS UserName,
purchases.id AS PurchaseID,
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
WHERE users.id = "1561845146";

