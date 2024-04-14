import express from "express";
import protect from "../middleware/authMiddleware.js";
import { allMessages,  deleteChat,  sendMessage } from "../Controllers/messageController.js";

const router = express.Router();

router.route("/:chatId").get(protect,allMessages); // get request on dynamic colonn(:)..message/:chatId
router.route("/").post(protect,sendMessage); // message/ post request on this route..
router.route("/delete/:chatid").delete(protect,deleteChat);
export default router;