import express from "express";
import { signup, login } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").exists().withMessage("Password is required"),
  ],
  login
);

export default router;
