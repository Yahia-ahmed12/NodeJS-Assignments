const { db } = require("../db/db.js");

const createStoreManagerUser = async (req, res) => {
  try {
    await db.query(
      "CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'StorePass123!'",
    );
    await db.query(
      "GRANT SELECT, INSERT, UPDATE ON *.* TO 'store_manager'@'localhost'",
    );
    await db.query("FLUSH PRIVILEGES");

    return res.status(200).json({
      message:
        "User store_manager created and permissions granted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//  Revoke UPDATE permission from store_manager
const revokeUpdatePermission = async (req, res) => {
  try {
    await db.query("REVOKE UPDATE ON *.* FROM 'store_manager'@'localhost'");
    await db.query("FLUSH PRIVILEGES");

    return res.status(200).json({
      message: "UPDATE permission revoked from store_manager successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//  Grant DELETE permission to store_manager on Sales table only
const grantDeleteOnSales = async (req, res) => {
  try {
    await db.query("GRANT DELETE ON Sales TO 'store_manager'@'localhost'");
    await db.query("FLUSH PRIVILEGES");

    return res.status(200).json({
      message:
        "DELETE permission on Sales table granted to store_manager successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createStoreManagerUser,
  revokeUpdatePermission,
  grantDeleteOnSales,
};
