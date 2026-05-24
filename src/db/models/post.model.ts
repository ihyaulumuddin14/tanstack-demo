import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    content: String,
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
