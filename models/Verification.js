import mongoose, { Schema } from "mongoose";

const verificationSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true
                },
                answer: {
                    type: String,
                    default: "",
                },
                score: {
                    type: Number,
                    min: 0,
                    max: 100,
                    default: 0,
                },
                feedback: {
                    type: String,
                    default: "",
                },
            },
        ],

        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        passed:{
            type: Boolean,
            default: false,
        },
        feedback: {
            type: String,
            default: "",
        },
        attemptNumber: {
            type: Number,
            default: 1,
        },
        attemptedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Verification", verificationSchema);