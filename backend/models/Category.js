import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  label: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true }, // store icon name or identifier
  items: { type: Number, default: 0 },
  description: { type: String },
  tag: { type: String },
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
