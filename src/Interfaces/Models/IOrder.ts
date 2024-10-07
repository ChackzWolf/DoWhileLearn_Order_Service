export interface IOrder {
    userId: string;
    transactionId: string;
    tutorId: string;
    courseId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare?: string;
    tutorShare?: string;
    createdAt?: Date;
    paymentStatus?: boolean;
    sessionId?: string;
    metadata?: Record<string, string>;
  }