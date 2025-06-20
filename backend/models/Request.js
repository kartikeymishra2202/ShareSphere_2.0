import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    itemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    requesterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    requestDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);
export default Request;
