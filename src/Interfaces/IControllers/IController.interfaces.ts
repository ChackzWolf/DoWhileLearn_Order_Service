import * as grpc from '@grpc/grpc-js';
import { CreateOrderDTO, CreateOrderResponse } from "../DTOs/IController.dto";

export interface IOrderController{
    CreateOrder (call: grpc.ServerUnaryCall<CreateOrderDTO, CreateOrderResponse>, callback: grpc.sendUnaryData<CreateOrderResponse>):Promise<void>
}
