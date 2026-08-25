const express = require("express");
const { bootstrapDB } = require("./db/db.js");

const {
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
} = require("./products/products.controller.js");

const {
  CreateSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  changeContactNumber,
  getSuppliersStartingWithF,
} = require("./suppliers/suppliers.controller.js");

const {
  recordSale,
  getAllSales,
  getSalesByProductId,
  getTotalQuantitySoldPerProduct,
  getAllSalesWithProductDetails,
} = require("./sales/sales.controller.js");

const {
  createStoreManagerUser,
  revokeUpdatePermission,
  grantDeleteOnSales,
} = require("./users/users.controller.js");
const app = express();
const port = 3000;

app.use(express.json());

// product
app.post("/products", createProduct);
app.get("/products", getAllProducts);
app.get("/products/highest-stock", getHighestStockProduct);
app.get("/products/unsold", getUnsoldProducts);
app.get("/products/:productID", getProductById);

app.patch("/products/add-category", addCategoryColumn);
app.patch("/products/set-not-null", addNotNullToProductName);
app.patch("/products/update-bread-price", updateBreadPrice);

app.put("/products/:productID", updateProduct);

app.delete("/products/remove-category", removeCategoryColumn);
app.delete("/products/delete-eggs", deleteEggsProduct);
app.delete("/products/:productID", deleteProduct);

// siuppliers
app.post("/suppliers", CreateSupplier);
app.get("/suppliers", getAllSuppliers);
app.patch("/suppliers/modify-contact", changeContactNumber);
app.get("/suppliers/name-starts-with-f", getSuppliersStartingWithF);
app.put("/suppliers/:supplierID", updateSupplier);
app.delete("/suppliers/:supplierID", deleteSupplier);

// sales
app.post("/sales", recordSale);
app.get("/sales", getAllSales);
app.get("/sales/details", getAllSalesWithProductDetails);
app.get("/sales/total-quantity-per-product", getTotalQuantitySoldPerProduct);
app.get("/sales/product/:productID", getSalesByProductId);

// users
app.post("/admin/create-store-manager", createStoreManagerUser);
app.post("/admin/revoke-update", revokeUpdatePermission);
app.post("/admin/grant-delete-sales", grantDeleteOnSales);

bootstrapDB(app, port);
