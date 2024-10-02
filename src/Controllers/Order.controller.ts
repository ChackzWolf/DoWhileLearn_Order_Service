import { handleUnaryCall } from '@grpc/grpc-js';
import * as grpc from '@grpc/grpc-js';
import { OrderService } from "../UseCase.ts/Order.useCase";
import { IOrder } from "../Interfaces/IOrder";
const orderService = new OrderService()
class OrderController {



    createStripeSession: handleUnaryCall<IOrder, any> = async (call, callback) => {
        try {
            const orderData: IOrder = call.request;
            console.log("Received order data from API Gateway:", orderData);
            const result = await orderService.CreateOrder(orderData);

            if (result.success) {
                console.log("Order placed successfully:", result);

                callback(null, { session_id: result.sessionId }); // Send order data in response
            } else {
                console.log("Order placement failed:", result);
                callback(null, { session_id: "", data: null }); // Send empty session id and null data on failure
            }
        } catch (error) {
            console.error("Error in purchasing the course:", error);
            callback(error as grpc.ServiceError);
        }
    };  
}

export default OrderController;
 