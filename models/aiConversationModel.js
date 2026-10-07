import { Schema, model } from "mongoose";

const aiConversationSchema = new Schema(
    {
        sessionId: {
            type: String,
            required: true,
            index: true
        },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },

        message: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model("AIConversation", aiConversationSchema);