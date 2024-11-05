import { IOrder } from "../Interfaces/Models/IOrder";
import dotenv from 'dotenv';
dotenv.config();

import { OrderData, OrderRepository } from "../Repositories/Order.repository";
import Stripe from "stripe";
import { IOrderService } from "../Interfaces/IService/IService.interface";
import { CreateOrderDTO, CreateOrderResponse } from "../Interfaces/DTOs/IController.dto";
import { configs } from "../Configs/ENV-Configs/ENV.configs";
import { kafkaConfig } from "../Configs/Kafka";

// types/events.ts
export interface OrderEvent {
    orderId: string;
    userId: string;
    courseId: string;
    tutorId: string;
    status: 'SUCCESS' | 'FAILED';
    timestamp: Date;
  }
  
  // types/events.ts
  export interface OrderEventData {
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
    timestamp: Date;
    status: string;
  }
const orderRepository = new OrderRepository()

const stripe = new Stripe(configs.STRIPE_SECRET_KEY!);

export class OrderService implements IOrderService{

    

    async handlePaymentSuccess(paymentEvent: OrderEventData): Promise<void> {
      try {
        // Create order in database
        
        const response = await orderRepository.saveOrder(paymentEvent);
        if(!response.success){
          throw new Error("order success is false");
        }
        await kafkaConfig.sendMessage('order.response', {
          success: true,
          service: 'order-service',
          status: 'COMPLETED',
          transactionId: paymentEvent.transactionId
        });
      
      } catch (error:any) {
        console.error('Order processing failed:', error);
      
        // Notify orchestrator of failure
        await kafkaConfig.sendMessage('order.response', {
          ...paymentEvent,
          service: 'order-service',
          status: 'FAILED',
          error: error.message
        });
      }
    }
 
    async handleTransactionFail(failedTransactionEvent:OrderEventData){
      try {
        await orderRepository.deleteOrder(failedTransactionEvent.transactionId)
        await kafkaConfig.sendMessage('rollback-completed', {
          transactionId: failedTransactionEvent.transactionId,
          service: 'order-service'
        });
      } catch (error) {
        console.error('Order rollback failed:', error)
      }
    }

/////////////////// above create order sructure is temporary;
    async CreateOrder(orderData: CreateOrderDTO): Promise<CreateOrderResponse> {
        try {
            console.log('Reached use case for purchasing order');
            const price = parseFloat(orderData.price);  // Convert string to number
            const tutorShare = (price * 0.95).toFixed(2);
            const adminShare = (price * 0.05).toFixed(2);

            const data:OrderData = {
                userId: orderData.userId,
                tutorId: orderData.tutorId,
                courseId: orderData.courseId,
                transactionId: orderData.transactionId,
                title: orderData.title,
                thumbnail: orderData.thumbnail,
                price: orderData.price,
                adminShare: adminShare.toString(),
                tutorShare: tutorShare.toString(),
                paymentStatus:true
            }

            // Save the order in the database
            const order = await orderRepository.saveOrder(data);
            console.log(order, 'this is created order')
            if(order.success){
                return {
                    success: true,
                    message: "Order successfully created",
                    order:order.order,
                };
            }else{
                 return {
                    success:false,
                    message:"order creation failed",
                 }
            }

        } catch (error) {
            console.log("Error in purchasing course(use-case):", error);  
            return { success: false, message: "Failed to create order." };
        }
    }
}
