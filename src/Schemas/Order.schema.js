"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    tutorId: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    adminShare: {
        type: String,
        // required: true,
    },
    tutorShare: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    paymentStatus: {
        type: Boolean,
        default: false,
    },
    sessionId: {
        type: String,
    },
    metadata: {
        type: Map,
        of: String,
    },
    status: {
        type: String
    }
});
exports.Order = mongoose_1.default.model("Order", OrderSchema);
