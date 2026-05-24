import { IPostDocument } from "@/features/posts/types";
import mongoose, { Model, Schema } from "mongoose";

const PostSchema = new Schema<IPostDocument>(
  {
    content: String,

    likesCount: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

// Check if model exists to prevent overwrite error in Next.js hot reloading
export const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>("Post", PostSchema);
