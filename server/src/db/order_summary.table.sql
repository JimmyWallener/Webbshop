DROP TABLE IF EXISTS Details;

CREATE TABLE Details (
    id INT NOT NULL AUTO_INCREMENT,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    totalPrice DECIMAL(10, 2),
    PRIMARY KEY (id),
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id)
);