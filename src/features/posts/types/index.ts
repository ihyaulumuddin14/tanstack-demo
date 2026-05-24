import type { Document, Types } from "mongoose";

export interface IPost {
  _id: string;
  content: string;
  likesCount: number;
  likedBy: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likedByMe?: boolean;
}

export interface IPostDocument extends Document {
  content: string;

  likesCount: number;

  likedBy: Types.ObjectId[];

  authorId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
