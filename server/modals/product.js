import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
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
    Material: {
      type: String,
      required: true,
    },
    MaterialInBn: {
      type: String,
      required: true,
    },
    Brand: {
      type: String,
    },
    Images: {
      type: [String],
      required: true,
    },
    ImageIds: {
      type: [String],
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    DiscountedPrice: {
      type: Number,
    },
    DiscountPercentage: {
      type: Number,
    },
    Ribbon: {
      type: String,
    },
    Stock: {
      type: Number,
    },
    Colors: {
      type: [String],
    },
    Sizes: {
      type: [String],
    },
    ListedSection: {
      type: String,
      enums: ["Today", "BestSelling", "Explore", "NewArrival"],
      required: true,
    },
    Collection: {
      type: String,
    },
    Description: {
      type: String,
      required: true,
    },
    DescriptionInBn: {
      type: String,
    },
    RatingQty: {
      type: Number,
      default: 0,
    },
    AverageRating: {
      type: Number,
      default: 0,
    },
    RatingLabel: {
      type: String,
      default: "Top Picks",
    },
    Reviews: [
      {
        Rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        ReviewText: {
          type: String,
        },
        ReviewerName: {
          type: String,
        },
        ReviewDate: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const RatingLabels = [
  { label: "Top Rated", min: 4.5 },
  { label: "Best Reviewed", min: 4.0 },
  { label: "Highly Rated", min: 3.5 },
  { label: "Editor's Choice", min: 3.0 },
  { label: "Customer Favorites", min: 2.5 },
  { label: "Top Picks", min: 2.0 },
  { label: "Recommended", min: 1.5 },
  { label: "Five-Star", min: 1.0 },
  { label: "Most Popular", min: 0.5 },
  { label: "Trending", min: 0.0 },
];

productSchema.methods.calculateRatings = function () {
  if (this.Reviews.length > 0) {
    const totalRating = this.Reviews.reduce(
      (sum, review) => sum + review.Rating,
      0
    );
    this.AverageRating = totalRating / this.Reviews.length;
    this.RatingQty = this.Reviews.length;
  } else {
    this.AverageRating = 0;
    this.RatingQty = 0;
  }

  this.RatingLabel =
    RatingLabels.find((label) => this.AverageRating >= label.min)?.label ||
    "Trending";
};

productSchema.pre("save", function (next) {
  this.calculateRatings();
  next();
});

const Products = mongoose.model("product", productSchema);

export default Products;
