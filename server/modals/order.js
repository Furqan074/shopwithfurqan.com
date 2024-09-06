import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    customerPhone: {
      type: Number,
    },
    deliveryAddress: {
      type: String,
    },
    orderedItems: [
      {
        name: String,
        color: String,
        size: String,
        qty: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Delivered", "Cancelled", "Pending"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("orders", orderSchema);

export default Orders;
