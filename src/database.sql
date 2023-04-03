-- Active: 1680540648917@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (id, email, password)
VALUES
("1", "fulaninho@hotmail.com","123123"),
("2","cicrano@hotmail.com", "321654"),
("3", "beltrano@gmail.com", "95143647");

SELECT * FROM users;

CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

INSERT INTO products(id, name, price, category)
VALUES
("a1", "camiseta astronauta", 49.99, "Camisetas"),
("a2", "bermuda sport", 69.9, "Bermudas"),
("a3", "Casaco Adidas Sport", 179.99, "Casacos"),
("a4", "camiseta keep calm preta", 59.90, "Camisetas"),
("a5", "Casaco couro marrom", 195.90, "Casacos");

SELECT * FROM products;