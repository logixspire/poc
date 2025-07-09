import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  async scheduleNotification(title: string, body: string, date: Date, id: number) {
    await LocalNotifications.requestPermissions();
    await LocalNotifications.schedule({
      notifications: [{
        title,
        body,
        id,
        schedule: { at: date }
      }]
    });
  }
}
