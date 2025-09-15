import e from "express";
import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// Add food item
const addFood = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    // Validate required fields (except image)
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.category) {
      // Delete uploaded file if validation fails
      if (req.file) {
        const filePath = path.join("uploads", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(400).json({
        success: false,
        message: "All fields (name, description, price, category) are required",
      });
    }

    // If image uploaded, take filename, else null
    const image_filename = req.file ? req.file.filename : null;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price), // Ensure price is number
      category: req.body.category,
      image: image_filename, // may be null if no image
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: "Food Added Successfully",
      food: {
        ...food.toObject(),
        imageUrl: image_filename ? `/uploads/${image_filename}` : null, // return URL if exists
      },
    });
  } catch (error) {
    console.error("Error adding food:", error.message);

    // Delete uploaded file if DB save fails
    if (req.file) {
      const filePath = path.join("uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    res.status(500).json({ success: false, message: "Error fetching food list" });
  }
};

// remove food item

const removeFood = async (req,res)=>{
      try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
      } catch (error) {
          console.log(error);
          res.json({success:false,message:"Error"})
        
      }
}
export { addFood, listFood,removeFood };
