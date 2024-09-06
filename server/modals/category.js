import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      unique: true,
      required: true,
    },
    NameInBn: {
      type: String,
      unique: true,
    },
    SubCategories: {
      type: [String],
    },
    SubCategoriesInBn: {
      type: [String],
    },
    Image: {
      type: String,
      required: true,
    },
    ImageId: {
      type: String,
      required: true,
    },
    ProductsAssigned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model("categories", categorySchema);

export default Categories;
