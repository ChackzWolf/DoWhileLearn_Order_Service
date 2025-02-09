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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newEntity = new this.model(data);
                const savedEntity = yield newEntity.save();
                return { success: true, message: "Save successful", entity: savedEntity };
            }
            catch (error) {
                console.error("Error saving:", error);
                return { success: false, message: "Save failed" };
            }
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.deleteOne(filter); // Cast filter as any for type compatibility
                return result.deletedCount
                    ? { success: true, message: "Delete successful" }
                    : { success: false, message: "Not found or already deleted" };
            }
            catch (error) {
                console.error("Delete error:", error);
                return { success: false, message: "Delete failed" };
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find();
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne(filter);
            }
            catch (error) {
                console.error("Error finding one:", error);
                return null;
            }
        });
    }
    findMany(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find(filter);
            }
            catch (error) {
                console.error("Error finding documents:", error);
                return [];
            }
        });
    }
    count() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                return yield this.model.countDocuments(filter);
            }
            catch (error) {
                console.error("Error counting documents:", error);
                return 0;
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
