import type { Document, Types } from "mongoose";

export interface NotificationUnreadCountResponse {
  count: number;
}

export interface INotificationDocument extends Document {
  userId: Types.ObjectId;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}
