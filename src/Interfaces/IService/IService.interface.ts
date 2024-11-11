import { OrderEventData } from "../DTOs/IController.dto";
import { IOrder } from "../Models/IOrder";


export interface IOrderService {
    handlePaymentSuccess(paymentEvent: OrderEventData): Promise<void>
    handleTransactionFail(failedTransactionEvent:OrderEventData):Promise<void>
    fetchAllOrders():Promise<{success:boolean,orderData?:IOrder[]}>
}