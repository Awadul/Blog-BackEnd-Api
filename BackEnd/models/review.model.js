import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
    },
    review: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Review = new mongoose.model("review", reviewSchema);
export default Review;