
import { Order } from "../Model/Order.model";


export interface OrderData {
    userId: string;
    tutorId: string;
    courseId: string;
    transactionId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare: string;
    tutorShare: string;
    paymentStatus:boolean;
}
export class OrderRepository {
    async saveOrder(orderData:OrderData){
        try {
            const newOrder = new Order({
                ...orderData,
                createdAt: new Date(), // Ensure this is set correctly
            });
            await newOrder.save();
            console.log('Order saved in database');
            return { success: true, message: "Order successful", order: newOrder };
        } catch (error) {
            
            console.log("Error in saaving the order",error);
            return { success: false, message: "Order failed. Please try again" };
        }
    }
}