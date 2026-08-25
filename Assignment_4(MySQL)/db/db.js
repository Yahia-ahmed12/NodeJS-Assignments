const mysql2 = require("mysql2/promise");

const db = mysql2.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 4,
  queueLimit: 0,
});

async function bootstrapDB(app, port = 3000) {
  try {
    await db.query("SELECT 1 + 1 AS result");
    console.log("Database Connected Successfully 🌸");

    await db.query("CREATE DATABASE IF NOT EXISTS retail_store;");
    await db.query("USE retail_store;");

    await db.query(`
      CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierName TEXT,
        ContactNumber TEXT
      );

      CREATE TABLE IF NOT EXISTS Products (
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName TEXT,
        Price DECIMAL(10, 2),
        StockQuantity INT,
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS Sales (
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        ProductID INT,
        QuantitySold INT,
        SaleDate DATE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
      );
    `);
    console.log("Tables Created Successfully 🚀");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed To connect Database:", error.message);
    process.exit(1);
  }
}

module.exports = { db, bootstrapDB };
