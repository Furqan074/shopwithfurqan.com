import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      unique: true,
      required: true,
    },
    NameInUr: {
      type: String,
      unique: true,
    },
    Material: {
      type: String,
      required: true,
    },
    MaterialInUr: {
      type: String,
      required: true,
    },
    Brand: {
      type: String,
    },
    Media: [
      {
        source: {
          type: String,
          required: true,
        },
        mediaType: {
          type: String,
          required: true,
        },
        mediaId: {
          type: String,
          required: true,
        },
      },
    ],
    Price: {
      type: Number,
      required: true,
    },
    Shipping: {
      type: String,
      required: true,
      enum: ["true", "false"],
    },
    DiscountedPrice: {
      type: Number,
      default: 0,
    },
    DiscountPercentage: {
      type: Number,
    },
    Ribbon: {
      type: String,
    },
    Stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    Colors: {
      type: [String],
    },
    Sizes: {
      type: [String],
    },
    ListedSection: {
      type: String,
      enum: ["today", "bestselling", "explore", "NewArrival"],
      required: true,
    },
    Collection: {
      type: String,
    },
    Description: {
      type: String,
      required: true,
    },
    DescriptionInUr: {
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
