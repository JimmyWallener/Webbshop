DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    articleNumber VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (id)
);