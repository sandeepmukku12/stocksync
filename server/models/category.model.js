const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Cascade Delete Logic: Remove all products when category is deleted
categorySchema.pre("findOneAndDelete", async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    await mongoose.model("Product").deleteMany({ category: docToUpdate._id });
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
