import mongoose from "mongoose";
import { configs } from "../ENV_Configs/ENV.configs";


export const connectDB = async ()=>{
    try {
        await  mongoose.connect(configs.MONGODB_URL_ORDER);
        console.log("Database Connected")
    } catch(error){
        console.log(error,"Database connection error")
    }
}