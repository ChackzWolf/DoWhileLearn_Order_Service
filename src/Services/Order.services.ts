import dotenv from 'dotenv';
dotenv.config();

import { OrderRepository } from "../Repositories/Order_repositories/Order.repository";
import { IOrderService } from "../Interfaces/IService/IService.interface";
import { kafkaConfig } from "../Configs/Kafka_Configs/Kafka.configs";
import { OrderEventData } from "../Interfaces/DTOs/IController.dto";


const orderRepository = new OrderRepository()


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
        console.log('after sennding the message hahaha')
      
      } catch (error:any) {
        console.error('Order processing failed:', error);
      
        // Notify orchestrator of failure
        await kafkaConfig.sendMessage('order.response', {
          ...paymentEvent,
          service: 'order-service',
          status: 'FAILED',
          error: error.message
        });
        console.log('after sennding the message hahaha')
      }
    }
 
    async handleTransactionFail(failedTransactionEvent:OrderEventData):Promise<void>{
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

    async fetchAllOrders(){
      try {
        
      } catch (error) {
        
      }
    }
}
