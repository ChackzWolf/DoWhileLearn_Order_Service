import { IOrder } from "../Models/IOrder";

export interface CreateOrderDTO {
    courseId: string;
    userId: string;
    tutorId: string;
    category: string;
    thumbnail: string;
    title : string;
    price: string;
    level: string;
    totalLessons: string;
    transactionId: string;
}

export interface CreateOrderResponse{
    success:boolean;
    order?:IOrder; 
    message:string
}

