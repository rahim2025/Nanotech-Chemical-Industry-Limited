import express from "express"
import {protectRoute} from "../middlewares/protectRoute.js"  // check user logged in or not
import { getUsersForSidebar,getMessages,sendMessage } from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users",protectRoute,getUsersForSidebar)
router.get("/:id",protectRoute,getMessages)  //indivisuals chats
router.post("/send/:id",protectRoute,sendMessage)


export default router;