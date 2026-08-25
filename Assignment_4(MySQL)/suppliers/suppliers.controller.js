const { db } = require("../db/db.js");

// 1. Create a supplier
const CreateSupplier = async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;
    const query =
      "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)";

    const [result] = await db.query(query, [SupplierName, ContactNumber]);

    return res.status(201).json({
      message: "Supplier created successfully",
      supplierId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// 2. Retrieve all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const query = "SELECT * FROM Suppliers";
    const [suppliers] = await db.query(query);

    return res.status(200).json({
      message: "Suppliers retrieved successfully",
      data: suppliers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Update supplier information
const updateSupplier = async (req, res) => {
  try {
    const { supplierID } = req.params;
    const { SupplierName, ContactNumber } = req.body;

    const query = `
      UPDATE Suppliers 
      SET SupplierName = ?, ContactNumber = ? 
      WHERE SupplierID = ?
    `;

    const [result] = await db.query(query, [
      SupplierName,
      ContactNumber,
      supplierID,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({
      message: "Supplier updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. Delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    const { supplierID } = req.params;
    const query = "DELETE FROM Suppliers WHERE SupplierID = ?";
    const [result] = await db.query(query, [supplierID]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// //////////////
// 6. Change ContactNumber to VARCHAR(15)
const changeContactNumber = async (req, res) => {
  try {
    const query =
      "ALTER TABLE Suppliers MODIFY COLUMN ContactNumber VARCHAR(15)";
    await db.query(query);

    return res.status(200).json({
      message: "ContactNumber column modified to VARCHAR(15) successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 7. Retrieve suppliers whose names start with 'F'
const getSuppliersStartingWithF = async (req, res) => {
  try {
    const query = "SELECT * FROM Suppliers WHERE SupplierName LIKE ?";
    const [rows] = await db.query(query, ["F%"]);

    return res.status(200).json({
      message: "Suppliers starting with 'F' retrieved successfully",
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  CreateSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  changeContactNumber,
  getSuppliersStartingWithF,
};
