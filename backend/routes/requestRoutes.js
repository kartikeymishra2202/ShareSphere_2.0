import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/", authMiddleware, sendRequest);
router.get("/sent", authMiddleware, getSentRequests);
router.get("/received", authMiddleware, getReceivedRequests);
router.patch("/:id/approve", authMiddleware, approveRequest);
router.patch("/:id/reject", authMiddleware, rejectRequest);

export default router;
