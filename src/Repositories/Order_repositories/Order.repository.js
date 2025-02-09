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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const Order_schema_1 = require("../../Schemas/Order.schema");
const Base_repository_1 = require("../Base_repositories/Base.repository");
class OrderRepository extends Base_repository_1.BaseRepository {
    constructor() {
        super(Order_schema_1.Order);
    }
    saveOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.save(orderData);
        });
    }
    deleteOrder(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delete({ transactionId });
        });
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findAll();
        });
    }
    findOrdersByTutorId(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findMany({ tutorId });
        });
    }
}
exports.OrderRepository = OrderRepository;
