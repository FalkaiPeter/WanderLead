import { WlUser } from './user.model';
import { WlNotificationsMsgType } from '@wl-core/constants/notification-message-type.enum';

export interface WlNotification {
  eventUrl: string;
  date: number;
  userData: WlUser.Min;
  message: WlNotificationsMsgType;
  read: boolean;
}
