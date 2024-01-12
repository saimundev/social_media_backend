import express from "express";
import { createMessage, getMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/create-message", createMessage);
router.get("/get-message/:chatId", getMessage);

export default router;
