import { OrderEventData } from "../DTOs/IController.dto";


export interface IOrderService {
    handlePaymentSuccess(paymentEvent: OrderEventData): Promise<void>
    handleTransactionFail(failedTransactionEvent:OrderEventData):Promise<void>
}