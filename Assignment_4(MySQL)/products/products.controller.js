const { db } = require("../db/db.js");
// 1. Create a product
const createProduct = async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    const query = `
      INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      ProductName,
      Price,
      StockQuantity,
      SupplierID,
    ]);

    return res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Retrieve all products
const getAllProducts = async (req, res) => {
  try {
    const query = "SELECT * FROM Products";
    const [products] = await db.query(query);

    return res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Retrieve a product by ID
const getProductById = async (req, res) => {
  try {
    const { productID } = req.params;
    const query = "SELECT * FROM Products WHERE ProductID = ?";
    const [products] = await db.query(query, [productID]);

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product retrieved successfully",
      data: products[0],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Update a product
const updateProduct = async (req, res) => {
  try {
    const { productID } = req.params;
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;
    const query = `
      UPDATE Products 
      SET ProductName = ?, Price = ?, StockQuantity = ?, SupplierID = ? 
      WHERE ProductID = ?
    `;
    const [result] = await db.query(query, [
      ProductName,
      Price,
      StockQuantity,
      SupplierID,
      productID,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { productID } = req.params;
    const query = "DELETE FROM Products WHERE ProductID = ?";
    const [result] = await db.query(query, [productID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

///////////////////////////////////
// 1. Add Category column to Products table
const addCategoryColumn = async (req, res) => {
  try {
    const query = "ALTER TABLE Products ADD Category VARCHAR(255)";
    await db.query(query);

    return res.status(200).json({
      message: "Category column added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// 2. Remove the Category column
const removeCategoryColumn = async (req, res) => {
  try {
    const query = "ALTER TABLE Products DROP COLUMN Category";
    await db.query(query);

    return res.status(200).json({
      message: "Category column removed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Add a NOT NULL constraint to ProductName
const addNotNullToProductName = async (req, res) => {
  try {
    const query =
      "ALTER TABLE Products MODIFY COLUMN ProductName VARCHAR(255) NOT NULL";
    await db.query(query);

    return res.status(200).json({
      message: "NOT NULL constraint added to ProductName successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Update price of Bread (or by product name)
const updateBreadPrice = async (req, res) => {
  try {
    const query = "UPDATE Products SET Price = ? WHERE ProductName = ?";
    const [result] = await db.query(query, [25.0, "Bread"]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product 'Bread' not found" });
    }

    return res.status(200).json({
      message: "Price of Bread updated to 25.00 successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Delete the product 'Eggs'
const deleteEggsProduct = async (req, res) => {
  try {
    const query = "DELETE FROM Products WHERE ProductName = ?";
    const [result] = await db.query(query, ["Eggs"]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product 'Eggs' not found" });
    }

    return res.status(200).json({
      message: "Product 'Eggs' deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Reporting endpoint: Retrieve the product with the highest stock quantity
const getHighestStockProduct = async (req, res) => {
  try {
    const query = `
      SELECT * 
      FROM Products 
      ORDER BY StockQuantity DESC 
      LIMIT 1
    `;
    const [rows] = await db.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({
      message: "Highest stock product retrieved successfully",
      data: rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//  Retrieve all products that have never been sold
const getUnsoldProducts = async (req, res) => {
  try {
    const query = `
      SELECT Products.* 
      FROM Products
      LEFT JOIN Sales ON Products.ProductID = Sales.ProductID
      WHERE Sales.ProductID IS NULL
    `;
    const [rows] = await db.query(query);

    return res.status(200).json({
      message: "Unsold products retrieved successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addCategoryColumn,
  removeCategoryColumn,
  addNotNullToProductName,
  updateBreadPrice,
  deleteEggsProduct,
  getHighestStockProduct,
  getUnsoldProducts,
};
