import { CreateOrderDTO, CreateOrderResponse } from "../DTOs/IController.dto";
import { IOrder } from "../Models/IOrder";

export interface IOrderService {
    CreateOrder(orderData: CreateOrderDTO):Promise<CreateOrderResponse>
}