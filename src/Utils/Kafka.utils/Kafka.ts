// // types/events.ts
// export interface OrderEvent {
//     orderId: string;
//     userId: string;
//     courseId: string;
//     tutorId: string;
//     status: 'SUCCESS' | 'FAILED';
//     timestamp: Date;
//   }
  
//   // types/events.ts
//   export interface PaymentEvent {
//     orderId: string;
//     userId: string;
//     courseId: string;
//     tutorId: string;
//     amount: number;
//     status: 'SUCCESS' | 'FAILED';
//     timestamp: Date;
//   }
  
//   // services/OrderService.ts
//   import { kafkaConfig } from '../../Configs/Kafka';
//   import { KafkaMessage } from 'kafkajs';
  
//   export class OrderService {
//     async start(): Promise<void> {
//       await kafkaConfig.consumeMessages(
//         'order-service-group',
//         ['payment.success','transaction-failed'],
//         this.handleMessage.bind(this)
//       );
//     }
  
//     private async handleMessage(message: KafkaMessage): Promise<void> {
//       try {
//         // if(message.status !==  'SUCCESS')
//         const paymentEvent: PaymentEvent = JSON.parse(message.value?.toString() || '');
//         console.log('START', paymentEvent, 'MESAGe haaha')
//         if(paymentEvent.status !== 'SUCCESS'){
//           await this.handleTransactionFail(paymentEvent)
//           return
//         }
//         await this.handlePaymentSuccess(paymentEvent);
//       } catch (error) {
//         console.error('Error processing message:', error);
//       }
//     }
  
//     private async handlePaymentSuccess(paymentEvent: PaymentEvent): Promise<void> {
//       try {
//         // Create order in database
//         await this.createOrder(paymentEvent);
  
//         const orderEvent: OrderEvent = {
//           orderId: paymentEvent.orderId,
//           userId: paymentEvent.userId,
//           courseId: paymentEvent.courseId,
//           tutorId: paymentEvent.tutorId,
//           status: 'SUCCESS',
//           timestamp: new Date()
//         };
  
//         await kafkaConfig.sendMessage('order.success', orderEvent);
  
//       } catch (error) {
//         console.error('Order creation failed:', error);
        
//         const failureEvent: OrderEvent = {
//           ...paymentEvent,
//           status: 'FAILED',
//           timestamp: new Date()
//         };
  
//         await kafkaConfig.sendMessage('order-transaction-failed', failureEvent);
//       }
//     }

//     private async handleTransactionFail(failedTransactionEvent:PaymentEvent){
//       try {
//         this.roleBackOrder(failedTransactionEvent);

//       } catch (error) {
        
//       }
//     }
  
//     private async roleBackOrder(failedTransactionEvent: PaymentEvent)  {
//       // Implement order role back here
//       console.log("Role back transaction fail", failedTransactionEvent);
//     }

//     private async createOrder(paymentEvent: PaymentEvent): Promise<void> {
//       // Implement order creation logic here
//       console.log(`Creating order for payment: ${paymentEvent.orderId}`);

      
//     }

//   }
  
  
  
  