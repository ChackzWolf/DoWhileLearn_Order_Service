import { IOrder } from "../Models/IOrder";

export interface CreateOrderDTO {
        tutorId: string;
        userId: string;
        price: string;
        adminShare: string;
        tutorShare: string;
        paymentStatus: boolean;
        createdAt: Date; 
        transactionId: string;
        sessionId?: string;
        metadata?: Map<string, string>;
        title: string;
        courseId: string;
        thumbnail: string;
        category: string;
        level: string;
        totalLessons: number;
}

export interface OrderResponseDTO {
    success: boolean;
    order?: IOrder;
    message: string;
}

