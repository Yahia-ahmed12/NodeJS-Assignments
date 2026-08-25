const { db } = require("../db/db.js");

// 1. Record a sale
const recordSale = async (req, res) => {
  try {
    const { ProductID, QuantitySold, SaleDate } = req.body;

    const query = `
      INSERT INTO Sales (ProductID, QuantitySold, SaleDate) 
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(query, [ProductID, QuantitySold, SaleDate]);

    return res.status(201).json({
      message: "Sale recorded successfully",
      saleId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Retrieve all sales
const getAllSales = async (req, res) => {
  try {
    const query = "SELECT * FROM Sales";
    const [sales] = await db.query(query);

    return res.status(200).json({
      message: "Sales retrieved successfully",
      data: sales,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Retrieve sales for a specific product
const getSalesByProductId = async (req, res) => {
  try {
    const { productID } = req.params;

    const query = "SELECT * FROM Sales WHERE ProductID = ?";
    const [sales] = await db.query(query, [productID]);

    return res.status(200).json({
      message: `Sales for Product ID ${productID} retrieved successfully`,
      data: sales,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Reporting endpoint: Total quantity sold for each product
const getTotalQuantitySoldPerProduct = async (req, res) => {
  try {
    const query = `
      SELECT 
        Products.ProductID,
        Products.ProductName,
        COALESCE(SUM(Sales.QuantitySold), 0) AS TotalQuantitySold
      FROM Products
      LEFT JOIN Sales ON Products.ProductID = Sales.ProductID
      GROUP BY Products.ProductID, Products.ProductName
    `;

    const [rows] = await db.query(query);

    return res.status(200).json({
      message: "Report retrieved successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  Reporting endpoint: Retrieve all sales with product details using SQL JOIN
const getAllSalesWithProductDetails = async (req, res) => {
  try {
    const query = `
      SELECT 
        Products.ProductName,
        Sales.QuantitySold,
        Sales.SaleDate
      FROM Sales
      JOIN Products ON Sales.ProductID = Products.ProductID
    `;

    const [rows] = await db.query(query);

    return res.status(200).json({
      message: "Sales report retrieved successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  recordSale,
  getAllSales,
  getSalesByProductId,
  getTotalQuantitySoldPerProduct,
  getAllSalesWithProductDetails,
};
