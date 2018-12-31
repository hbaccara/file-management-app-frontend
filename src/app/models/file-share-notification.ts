import { Notification } from '../models/notification';

export class FileShareNotification extends Notification{
    fileId: number;
    isFolder: boolean;
    filename: string;
    sharer: string;
  }