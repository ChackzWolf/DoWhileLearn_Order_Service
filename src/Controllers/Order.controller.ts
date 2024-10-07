import * as grpc from '@grpc/grpc-js';
import { OrderService } from "../Services/Order.services";
import { IOrder } from "../Interfaces/Models/IOrder";
import { IOrderController } from '../Interfaces/IControllers/IController.interfaces';
import { CreateOrderDTO, CreateOrderResponse } from '../Interfaces/DTOs/IController.dto';
const orderService = new OrderService()

export class OrderController implements IOrderController {
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

 