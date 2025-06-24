import express from "express";
import {
  getFeaturedItems,
  createFeaturedItem,
  updateFeaturedItem,
  deleteFeaturedItem,
  getFeaturedItemById,
} from "../controllers/featuredItemController.js";

const router = express.Router();

router.get("/", getFeaturedItems);
router.post("/", createFeaturedItem);
router.put("/:id", updateFeaturedItem);
router.delete("/:id", deleteFeaturedItem);
router.get("/:id", getFeaturedItemById);

export default router;
