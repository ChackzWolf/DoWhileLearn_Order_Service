import { OrderService } from "../Services/Order.services";
import { IOrderController } from '../Interfaces/IControllers/IController.interfaces';
import {kafkaConfig} from "../Configs/Kafka_Configs/Kafka.configs"
import { KafkaMessage } from 'kafkajs';
import { OrderEventData } from '../Interfaces/DTOs/IController.dto';
import * as grpc from '@grpc/grpc-js';
import { response } from "express";


  
const orderService = new OrderService()

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
      
      async handleMessage(message: KafkaMessage): Promise<void> {
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
          console.error('Error processing message:', error);
        }
      }

      async getOrdersOfTutor(call: grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>){
        try {
          const data = call.request;
          console.log('triggered payouts', data)
          const response = await orderService.fetchOrdersOfTutor(data);
          callback(null,response)
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }

      async fetchAllOrders(call: grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>){
        try {
          const response = await orderService.fetchAllOrders();
          callback(null,response);
        } catch (error) {
          
        }
      }

}

 