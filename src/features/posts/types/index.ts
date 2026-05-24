export interface IPost {
  _id: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
