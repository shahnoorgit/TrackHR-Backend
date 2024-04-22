import express from "express";
import {
  loginUser,
  signInUser,
  logoutUser,
} from "../controllers/User.controller.js";

const router = express.Router();

router.post("/sign-in", signInUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
