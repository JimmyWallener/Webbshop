DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders (
    id INT NOT NULL AUTO_INCREMENT,
    transactionDate DATE NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id)
);