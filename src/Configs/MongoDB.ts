import mongoose from "mongoose";

import config from "./Config";

export const connectDB = async ()=>{
    try {
        await  mongoose.connect(config.DATABASE_URL);
        console.log("Database Connected")
    } catch(error){
        console.log(error,"Database connection error")
    }
}