import express from "express";
import {
  loginUser,
  signInUser,
  logoutUser,
  UserStats,
} from "../controllers/User.controller.js";
import { report } from "../utils/Stats.js";

const router = express.Router();

router.post("/sign-up", signInUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/stats/:user_id", UserStats);

export default router;
