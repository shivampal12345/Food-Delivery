import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://ShivamPal:Shivampal8007@cluster0.sw7fq4e.mongodb.net/FOOD_DELIVERY').then(()=>console.log("DB COnnected"))
}