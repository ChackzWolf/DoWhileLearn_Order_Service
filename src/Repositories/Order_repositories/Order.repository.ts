// OrderRepository.ts
import { IOrder } from "../../Interfaces/Models/IOrder";
import { Order } from "../../Schemas/Order.schema";
import { BaseRepository } from "../Base_repositories/Base.repository";
import { ICourseDocument } from "../../Schemas/Order.schema";

export class OrderRepository extends BaseRepository<ICourseDocument> {
    constructor() {
        super(Order); 
    } 

    async saveOrder(orderData: IOrder) {
        return this.save(orderData);
    }

    async deleteOrder(transactionId: string) {
        return this.delete({ transactionId });
    }

    async getAllOrders() { 
        return this.findAll();
    }

    async findOrdersByTutorId(tutorId: string): Promise<IOrder[]> {
        return this.findMany({ tutorId });
    }

    async findOrdersByUserId(userId: string): Promise<IOrder[]> {
        return this.findMany({ userId });
    }
    
}