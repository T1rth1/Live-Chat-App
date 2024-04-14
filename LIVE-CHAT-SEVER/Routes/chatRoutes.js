import express from "express";
import protect from "../middleware/authMiddleware.js";
import { accessChat, addSelfToGroup, createGroupChat, displayChats, fetchGroups, groupExit } from "../Controllers/chatController.js";
const router = express.Router();

router.route("/").post(protect,accessChat);
router.route("/").get(protect,displayChats);
router.route("/createGroup").post(protect,createGroupChat);
router.route("/fetchGroups").get(protect,fetchGroups);
router.route("/groupExit").put(protect,groupExit);
router.route("/addSelfToGroup").put(protect,addSelfToGroup);

export default router;
