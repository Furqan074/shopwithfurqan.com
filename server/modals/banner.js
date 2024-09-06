import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Link: {
      type: String,
    },
    Media: {
      type: String,
      required: true,
    },
    SlideDelay: {
      type: Number,
      default: 2000,
    },
    MediaType: {
      type: String,
    },
    MediaId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banners = mongoose.model("banners", bannerSchema);

export default Banners;
