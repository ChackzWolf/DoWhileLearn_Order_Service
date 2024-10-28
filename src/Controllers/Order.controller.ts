import * as grpc from '@grpc/grpc-js';
import { OrderService } from "../Services/Order.services";
import { IOrderController } from '../Interfaces/IControllers/IController.interfaces';
import { CreateOrderDTO, CreateOrderResponse } from '../Interfaces/DTOs/IController.dto';
import { kafkaConfig } from "../Configs/Kafka";
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
  export interface PaymentEvent {
    orderId: string;
    userId: string;
    courseId: string;
    tutorId: string;
    amount: number;
    status: 'SUCCESS' | 'FAILED';
    timestamp: Date;
  }
export class OrderController implements IOrderController {
    
    async start(): Promise<void> {
        await kafkaConfig.consumeMessages(
          'order-service-group',
          ['payment.success','transaction-failed'],
          this.handleMessage.bind(this)
        );
      }
  
      // checking order  success or fail
      private async handleMessage(message: KafkaMessage): Promise<void> {
        try {
          const paymentEvent: PaymentEvent = JSON.parse(message.value?.toString() || '');
          console.log('START', paymentEvent, 'MESAGe haaha')
          if(paymentEvent.status !== 'SUCCESS'){
            await orderService.handleTransactionFail(paymentEvent)
            return
          }
          await orderService.handlePaymentSuccess(paymentEvent);
        } catch (error) {
          console.error('Error processing message:', error);
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

 