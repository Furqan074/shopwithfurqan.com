import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    Phone: {
      type: Number,
    },
    Address: {
      type: String,
    },
    Password: {
      type: String,
      required: true,
    },
    ResetPassToken: {
      type: String,
    },
    ResetPassTokenExp: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Customers = mongoose.model("customer", customerSchema);

export default Customers;
