import { CreateOrderDTO, CreateOrderResponse } from "../DTOs/IController.dto";

export interface IOrderService {
    CreateOrder(orderData: CreateOrderDTO):Promise<CreateOrderResponse>
}