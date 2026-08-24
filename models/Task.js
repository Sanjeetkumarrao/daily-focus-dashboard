import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            default: "Other",
            trim: true
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
        dueDate: {
            type: Date,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);