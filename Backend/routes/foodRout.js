import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and random number
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood)

// Error handling middleware for multer
foodRouter.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
  }
  
  if (error.message.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

export default foodRouter;