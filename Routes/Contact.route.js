import express from "express";
import {
  createContact,
  deleteContact,
  fetchMyContacts,
  updateContact,
} from "../controllers/Contact.controller.js";

const router = express.Router();

router.post("/create", createContact);
router.post("/delete", deleteContact);
router.post("/edit", updateContact);
router.get("/mycontact/:_id", fetchMyContacts);

export default router;
