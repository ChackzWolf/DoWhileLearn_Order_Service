import * as grpc from '@grpc/grpc-js';
import { KafkaMessage } from 'kafkajs';


export interface IOrderController{
    start(): Promise<void>
    routeMessage(topics:string[], message:KafkaMessage, topic:string):Promise<void>
    handleMessage(message: KafkaMessage): Promise<void>
    handleRollback(message:KafkaMessage): Promise<void>
}
