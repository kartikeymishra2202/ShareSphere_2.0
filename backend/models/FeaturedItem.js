import mongoose from "mongoose";

const FeaturedItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
});

const FeaturedItem = mongoose.model("FeaturedItem", FeaturedItemSchema);
export default FeaturedItem;
