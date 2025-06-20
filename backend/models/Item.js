import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: { type: String, enum: ["Available", "Lent"], default: "Available" },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema);
export default Item;
