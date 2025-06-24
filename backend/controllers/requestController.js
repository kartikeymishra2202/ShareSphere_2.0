import Request from "../models/Request.js";
import Item from "../models/Item.js";
import Chat from "../models/Chat.js";
import { io } from "../server.js";

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

export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "itemID requesterID ownerID"
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (
      request.requesterID._id.toString() !== req.user._id.toString() &&
      request.ownerID._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.requesterID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (request.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be cancelled" });
    }
    await request.deleteOne();
    res.json({ message: "Request cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ requestID: req.params.id }).populate(
      "messages.senderID"
    );
    if (!chat) return res.json({ messages: [] });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ message: "Message text required" });
    let chat = await Chat.findOne({ requestID: req.params.id });
    if (!chat) {
      chat = new Chat({ requestID: req.params.id, messages: [] });
    }
    chat.messages.push({ senderID: req.user._id, text });
    await chat.save();
    await chat.populate("messages.senderID");
    io.to(req.params.id).emit("chat:new_message", {
      requestID: req.params.id,
      message: chat.messages[chat.messages.length - 1],
    });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
