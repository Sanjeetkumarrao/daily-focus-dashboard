import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        // Email verification
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        emailVerificationToken: {
            type: String,
            default: null,
        },

        emailVerificationExpires: {
            type: Date,
            default: null,
        },

        avatar: {
            type: String,
            default: "",
        },

        preferences: {
            theme: {
                type: String,
                enum: ["dark", "system", "light"],
                default: "system",
            },

            notifications: {
                type: Boolean,
                default: true,
            },

            timezone: {
                type: String,
                default: "Asia/Kolkata",
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model("User", userSchema);