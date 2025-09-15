import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRout.js";
import userRouter from "./routes/UserRout.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRout.js";
import orderRouter from "./routes/orderRout.js";

//app config
const app = express();
const port =process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

//api endpoint
app.use("/api/food",foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.get("/" ,(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`)
})

