const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// CASCADE DELETE: Before a category is deleted, remove all products linked to it
categorySchema.pre('findOneAndDelete', async function(next) {
  const categoryId = this.getQuery()._id;
  
  // We access the Product model to wipe related items
  try {
    await mongoose.model('Product').deleteMany({ category: categoryId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Category", categorySchema);
