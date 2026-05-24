export interface IPost {
  _id: string;
  content: string;
  likes: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
