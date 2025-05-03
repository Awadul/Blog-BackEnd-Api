import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    tagLine: {
        type: "String",
        required: true,
        unique: true,
    },
    cover: {
        type: "String",
    },
    content: {
        type: "String",
        required: true,
    }
}, { timestamps: true });

const Post = mongoose.model("post", postSchema);
export default Post;