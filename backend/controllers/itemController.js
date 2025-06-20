import Item from "../models/Item.js";
import Request from "../models/Request.js";

export const addItem = async (req, res) => {
  try {
    const { title, category } = req.body;
    const item = new Item({
      title,
      category,
      ownerID: req.user._id,
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ ownerID: req.user._id }).populate(
      "category"
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeaturedItems = async (req, res) => {
  try {
    // Featured: e.g., most recent or random
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("category");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.ownerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.ownerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
