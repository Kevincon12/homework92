import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    username: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;