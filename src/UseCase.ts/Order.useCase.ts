import { IOrder } from "../Interfaces/IOrder";
import dotenv from 'dotenv';
dotenv.config();

import { OrderRepository } from "../Repositories/Order.repository";
import Stripe from "stripe";

const orderRepository = new OrderRepository()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class OrderService {

    async CreateOrder(orderData: IOrder) {
        try {
            console.log('Reached use case for purchasing order');


            // Save the order in the database
            const order = await orderRepository.saveOrder({
                ...orderData,
                transactionId: "session.id",
                paymentStatus: false,
            });

            return {
                success: true,
                message: "Order successfully created",
                sessionId: "session.id", 
                order,
            };
        } catch (error) {
            console.log("Error in purchasing course(use-case):", error);
            return { success: false, message: "Failed to create order." };
        }
    }
}
