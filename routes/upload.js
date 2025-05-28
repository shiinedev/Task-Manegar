import express from "express";
import { uploadFile } from "../controllers/uploadController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/profile",protect, upload.single("file"),uploadFile)


export default router 