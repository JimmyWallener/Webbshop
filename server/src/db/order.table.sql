DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders (
    id INT NOT NULL AUTO_INCREMENT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);