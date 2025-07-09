import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { PouchdbService, Reminder } from '../services/pouchdb.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

 
  reminders: Reminder[] = [];
  newReminder: Reminder = { title: '', description: '', remindAt: '' };

  constructor(private dbService: PouchdbService, private notifyService: NotificationService) {}

  ngOnInit() {
    this.loadReminders();
    this.dbService.sync('http://localhost:5984/reminders');
  }

  async loadReminders() {
    this.reminders = await this.dbService.getReminders();
    console.log(this.reminders)
  }

  async saveReminder() {
    if (this.newReminder._id) {
      await this.dbService.updateReminder(this.newReminder);
    } else {
      await this.dbService.addReminder(this.newReminder);
      const date = new Date(this.newReminder.remindAt);
      await this.notifyService.scheduleNotification(
        this.newReminder.title,
        this.newReminder.description,
        date,
        Math.floor(Math.random() * 100000)
      );
    }
    this.newReminder = { title: '', description: '', remindAt: '' };
    this.loadReminders();
  }

  editReminder(reminder: Reminder) {
    this.newReminder = { ...reminder };
  }

  async delete(reminder: Reminder) {
    await this.dbService.deleteReminder(reminder);
    this.loadReminders();
  }
}
