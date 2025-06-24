import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addItem,
  getMyItems,
  getFeaturedItems,
  updateItem,
  deleteItem,
  getAllItems,
  getItemById,
} from "../controllers/itemController.js";

const router = express.Router();

router.post("/", authMiddleware, addItem);
router.get("/mine", authMiddleware, getMyItems);
router.get("/featured", getFeaturedItems);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);

export default router;
