import dotenv from 'dotenv';
dotenv.config();

import { OrderRepository } from "../Repositories/Order_repositories/Order.repository";
import { IOrderService } from "../Interfaces/IService/IService.interface";
import { kafkaConfig } from "../Configs/Kafka_Configs/Kafka.configs";
import { OrderEventData } from "../Interfaces/DTOs/IController.dto";
import { STATUS_CODES } from 'http';
import { IOrder } from '../Interfaces/Models/IOrder';


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
        const response = await orderRepository.deleteOrder(failedTransactionEvent.transactionId)
        console.log(response, 'response status')
        await kafkaConfig.sendMessage('rollback-completed', {
          transactionId: failedTransactionEvent.transactionId,
          service: 'order-service'
        });
      } catch (error) {
        console.error('Order rollback failed:', error)
      }
    }

    async fetchAllOrders():Promise<{success:boolean,orderData?:IOrder[]}>{
      try {
        const orderData = await orderRepository.getAllOrders();
        if(!orderData){
          return {success:false};
        }
        return {success:true, orderData};
      } catch (error) {
        throw new Error(`error form service while fetching orders ${error}`)
      }
    }

    async fetchOrdersOfTutor(data:{tutorId:string}):Promise<{ success:boolean, message?:string, orderData?:IOrder[]}>{
      const tutorId = data.tutorId;
      try {
        const orderData = await orderRepository.findOrdersByTutorId(tutorId);
        if(!orderData){
          return {message:'Order not found', success:false}
        }
        return {success:true, orderData};
      } catch (error) {
        throw new Error(`error form service while fetching tutor's orders ${error}`)
      }
    }

    async fetchOrdersOfUser(data:{userId:string}):Promise<{ success:boolean, message?:string, orderData?:IOrder[]}>{
      const userId = data.userId;
      try {
        const orderData = await orderRepository.findOrdersByUserId(userId);
        if(!orderData){
          return {message:'Order not found', success:false}
        }
        return {success:true, orderData};
      } catch (error) {
        throw new Error(`error form service while fetching tutor's orders ${error}`)
      }
    }
}
