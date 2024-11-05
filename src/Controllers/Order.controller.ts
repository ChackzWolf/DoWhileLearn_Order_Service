import * as grpc from '@grpc/grpc-js';
import { OrderService } from "../Services/Order.services";
import { IOrderController } from '../Interfaces/IControllers/IController.interfaces';
import { CreateOrderDTO, CreateOrderResponse } from '../Interfaces/DTOs/IController.dto';
import {kafkaConfig} from "../Configs/Kafka"
import { KafkaMessage } from 'kafkajs';
const orderService = new OrderService()
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
export class OrderController implements IOrderController {
    
    async start(): Promise<void> {
        const topics =          [
          'order.update',
          'order-service.rollback'
        ]

        await kafkaConfig.consumeMessages(
          'order-service-group', 
          topics, 
          this.routeMessage.bind(this)
        );
      }
  
      async routeMessage(topics:string[], message:KafkaMessage, topic:string):Promise<void>{
        try {
          switch (topic) {
            case 'order.update':
                await this.handleMessage(message); 
                break;
            case 'order-service.rollback': 
                await this.handleRollback(message);
                break;
            default: 
                console.warn(`Unhandled topic: ${topic}`);
          }
        } catch (error) { 
          
        }
      }
      // checking order  success or fail
      private async handleMessage(message: KafkaMessage): Promise<void> {
        try {
          const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
          console.log('START', paymentEvent, 'MESAGe haaha')
          await orderService.handlePaymentSuccess(paymentEvent);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }

      async handleRollback(message:KafkaMessage): Promise<void>{
        try {
          console.log('triggered rollback,')
          const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
          console.log('START Role back', paymentEvent, 'MESAGe haaha');
          await orderService.handleTransactionFail(paymentEvent);
        } catch (error) {
          
        }
      }

    async CreateOrder(call: grpc.ServerUnaryCall<CreateOrderDTO, CreateOrderResponse>, callback: grpc.sendUnaryData<CreateOrderResponse>): Promise<void> {     
        try {
            const orderData:CreateOrderDTO  = call.request; 
            console.log("Received order data from API Gateway:", orderData);
            const result = await orderService.CreateOrder(orderData);

            if (result.success) {
                console.log("Order placed successfully:", result);

                callback(null,{success: result.success, order: result.order, message: result.message}); // Send order data in response
            } else {
                console.log("Order placement failed:", result);
                callback(null, { message: "error creating order",success:false}); // Send empty session id and null data on failure
            }
        } catch (error) {
            console.error("Error in purchasing the course:", error);
            callback(error as grpc.ServiceError);
        }
    };  



}

 