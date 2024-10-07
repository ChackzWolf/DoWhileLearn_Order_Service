import { CreateOrderDTO } from "../DTOs/IRepository.dto"

export interface IOrderRepository {
    saveOrder(orderData:CreateOrderDTO):Promise<any>;
}
