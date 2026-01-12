const Product = require("../models/Product");

const getDashboardStats = async () => {
  const products = await Product.find();

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const inventoryValue = products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );

  return {
    totalProducts,
    lowStockCount,
    inventoryValue: inventoryValue.toFixed(2),
  };
};

module.exports = { getDashboardStats };
