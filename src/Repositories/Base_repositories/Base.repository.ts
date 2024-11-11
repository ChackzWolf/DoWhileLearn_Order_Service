import { Model, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async save(data: Partial<T>): Promise<{ success: boolean; message: string; entity?: T }> {
        try {
            const newEntity = new this.model(data);
            const savedEntity = await newEntity.save();
            return { success: true, message: "Save successful", entity: savedEntity };
        } catch (error) {
            console.error("Error saving:", error);
            return { success: false, message: "Save failed" };
        }
    }

    async delete(filter: Partial<T>): Promise<{ success: boolean; message: string }> {
        try {
            const result = await this.model.deleteOne(filter as any); // Cast filter as any for type compatibility
            return result.deletedCount
                ? { success: true, message: "Delete successful" }
                : { success: false, message: "Not found or already deleted" };
        } catch (error) {
            console.error("Delete error:", error);
            return { success: false, message: "Delete failed" };
        }
    }
}