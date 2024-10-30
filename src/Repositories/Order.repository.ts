
import { Order } from "../Schemas/Order.schema";


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
    async saveOrder(orderData:any){
        try {
            const newOrder = new Order({
                ...orderData,
                createdAt: new Date(), // Ensure this is set correctly
            });
            const savedOrder = await newOrder.save();
            if(!savedOrder){
                return {success:false, message: "could'nt save the order"}
            }
            console.log('Order saved in database');
            return { success: true, message: "Order successful", order: newOrder };
        } catch (error) {
            
            console.log("Error in saaving the order",error);
            return { success: false, message: "Order failed. Please try again" };
        }
    }

    async deleteOrder(orderId: string): Promise<{ success: boolean; message: string }> {
        try {
            const result = await Order.deleteOne({ transactionId: orderId });
            if (result.deletedCount === 0) {
                return { success: false, message: 'Order not found or already deleted' };
            }
            console.log('Order deleted from database');
            return { success: true, message: 'Order successfully deleted' };
        } catch (error) {
            console.error('Error deleting the order:', error);
            return { success: false, message: 'Failed to delete the order. Please try again' };
        }
    }
}