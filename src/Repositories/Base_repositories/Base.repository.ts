import { Model, Document, FilterQuery } from 'mongoose';

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

    async findAll(): Promise<T[]> {
        return this.model.find();
      }

      async findOne(filter: Partial<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter as FilterQuery<T>);
        } catch (error) {
            console.error("Error finding one:", error);
            return null;
        }
    }

    async findMany(filter: Partial<T>): Promise<T[]> {
        try {
            return await this.model.find(filter as FilterQuery<T>);
        } catch (error) {
            console.error("Error finding documents:", error);
            return [];
        }
    }

      async count(filter: Partial<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(filter as FilterQuery<T>);
        } catch (error) {
            console.error("Error counting documents:", error);
            return 0;
        }
    }
}