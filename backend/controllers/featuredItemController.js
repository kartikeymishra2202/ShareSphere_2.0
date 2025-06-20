import FeaturedItem from "../models/FeaturedItem.js";

export const getFeaturedItems = async (req, res) => {
  try {
    const items = await FeaturedItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFeaturedItem = async (req, res) => {
  try {
    const item = new FeaturedItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateFeaturedItem = async (req, res) => {
  try {
    const item = await FeaturedItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item)
      return res.status(404).json({ error: "Featured item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteFeaturedItem = async (req, res) => {
  try {
    const item = await FeaturedItem.findByIdAndDelete(req.params.id);
    if (!item)
      return res.status(404).json({ error: "Featured item not found" });
    res.json({ message: "Featured item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
