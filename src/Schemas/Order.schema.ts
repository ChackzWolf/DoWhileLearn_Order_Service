import mongoose, { Document, Schema } from "mongoose";
import { IOrder } from "../Interfaces/Models/IOrder";

export interface ICourseDocument extends IOrder, Document {}

const OrderSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  tutorId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  adminShare: {
    type: String,
    // required: true,
  },
  tutorShare: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
},
  paymentStatus: {
    type: Boolean,
    default: false,
  },
  sessionId: {
    type: String,
  },
  metadata: {
    type: Map,
    of: String,
  },
  status: { 
    type: String 
  }
});


export const Order = mongoose.model<ICourseDocument>("Order",OrderSchema);