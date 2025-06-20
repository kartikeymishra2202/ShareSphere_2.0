import Request from "../models/Request.js";
import Item from "../models/Item.js";

export const sendRequest = async (req, res) => {
  try {
    const { itemID } = req.body;
    const item = await Item.findById(itemID);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.ownerID.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot request your own item" });
    }
    // Prevent duplicate requests
    const existing = await Request.findOne({
      itemID,
      requesterID: req.user._id,
      status: "Pending",
    });
    if (existing)
      return res.status(400).json({ message: "Request already sent" });
    const request = new Request({
      itemID,
      requesterID: req.user._id,
      ownerID: item.ownerID,
    });
    await request.save();
    item.requests.push(request._id);
    await item.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requesterID: req.user._id }).populate(
      "itemID"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ ownerID: req.user._id }).populate(
      "itemID requesterID"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.ownerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    request.status = "Approved";
    await request.save();
    // Optionally update item status
    await Item.findByIdAndUpdate(request.itemID, { status: "Lent" });
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.ownerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    request.status = "Rejected";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
