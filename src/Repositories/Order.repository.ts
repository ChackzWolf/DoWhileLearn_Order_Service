
import { Order } from "../Model/Order.model";

import { IOrder } from "../Interfaces/IOrder"
export class OrderRepository {
    async saveOrder(orderData:IOrder){
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