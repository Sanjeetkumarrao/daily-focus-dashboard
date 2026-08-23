import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    milestones: [
      {
        title: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          default: "",
        },

        order: {
          type: Number,
          required: true,
        },
      },
    ],

    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    status: {
      type: String,
      enum: ["draft", "active", "completed", "cancelled"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Plan", planSchema);