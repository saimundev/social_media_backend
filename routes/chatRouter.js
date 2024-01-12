import express from "express";
import { createChat, getChats } from "../controllers/chatController.js";
const router = express.Router();

router.post("/create-chat", createChat);
router.get("/get-chats/:userId", getChats);

export default router;
