import mongoose, { Schema, Document, Model } from "mongoose";
import { IPost } from "@/features/posts/types";

// Extends IPost with Mongoose Document properties
export interface IPostDocument extends Omit<IPost, "_id">, Document {}

const PostSchema = new Schema<IPostDocument>(
  {
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    authorId: {
      type: String,
      required: true,
      index: true, // Useful for querying posts by a specific user
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Check if model exists to prevent overwrite error in Next.js hot reloading
export const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>("Post", PostSchema);
