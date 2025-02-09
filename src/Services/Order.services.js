"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Order_repository_1 = require("../Repositories/Order_repositories/Order.repository");
const Kafka_configs_1 = require("../Configs/Kafka_Configs/Kafka.configs");
const orderRepository = new Order_repository_1.OrderRepository();
class OrderService {
    handlePaymentSuccess(paymentEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create order in database
                const response = yield orderRepository.saveOrder(paymentEvent);
                if (!response.success) {
                    throw new Error("order success is false");
                }
                yield Kafka_configs_1.kafkaConfig.sendMessage('order.response', {
                    success: true,
                    service: 'order-service',
                    status: 'COMPLETED',
                    transactionId: paymentEvent.transactionId
                });
                console.log('after sennding the message hahaha');
            }
            catch (error) {
                console.error('Order processing failed:', error);
                // Notify orchestrator of failure
                yield Kafka_configs_1.kafkaConfig.sendMessage('order.response', Object.assign(Object.assign({}, paymentEvent), { service: 'order-service', status: 'FAILED', error: error.message }));
                console.log('after sennding the message hahaha');
            }
        });
    }
    handleTransactionFail(failedTransactionEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield orderRepository.deleteOrder(failedTransactionEvent.transactionId);
                console.log(response, 'response status');
                yield Kafka_configs_1.kafkaConfig.sendMessage('rollback-completed', {
                    transactionId: failedTransactionEvent.transactionId,
                    service: 'order-service'
                });
            }
            catch (error) {
                console.error('Order rollback failed:', error);
            }
        });
    }
    fetchAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderData = yield orderRepository.getAllOrders();
                if (!orderData) {
                    return { success: false };
                }
                return { success: true, orderData };
            }
            catch (error) {
                throw new Error(`error form service while fetching orders ${error}`);
            }
        });
    }
    fetchOrdersOfTutor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutorId = data.tutorId;
            try {
                const orderData = yield orderRepository.findOrdersByTutorId(tutorId);
                if (!orderData) {
                    return { message: 'Order not found', success: false };
                }
                return { success: true, orderData };
            }
            catch (error) {
                throw new Error(`error form service while fetching tutor's orders ${error}`);
            }
        });
    }
}
exports.OrderService = OrderService;
