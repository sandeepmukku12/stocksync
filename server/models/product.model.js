const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    lowStockThreshold: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

// Logic to automatically set status based on quantity before saving
productSchema.pre("save", function (next) {
  if (this.quantity <= 0) this.status = "Out of Stock";
  else if (this.quantity <= this.lowStockThreshold) this.status = "Low Stock";
  else this.status = "In Stock";
  next();
});

module.exports = mongoose.model("Product", productSchema);
