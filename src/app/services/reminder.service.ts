import PouchDB from 'pouchdb';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private db: PouchDB.Database;
  private remoteCouch = 'https://your-couchdb-host:5984/reminders';

  constructor() {
    this.db = new PouchDB('reminders');
    this.syncWithCouchDB();
  }

  private syncWithCouchDB() {
    this.db.sync(this.remoteCouch, {
      live: true,
      retry: true
    }).on('change', info => console.log('Sync Change:', info));
  }

  getAllReminders(): Promise<any[]> {
    return this.db.allDocs({ include_docs: true }).then(res => res.rows.map(r => r.doc));
  }

  addReminder(reminder: any) {
    reminder._id = new Date().toISOString();
    return this.db.put(reminder);
  }

  updateReminder(reminder: any) {
    return this.db.put(reminder);
  }

  deleteReminder(reminder: any) {
    return this.db.remove(reminder);
  }

  getReminder(id: string) {
    return this.db.get(id);
  }
}

export interface Reminder {
  _id?: string;
  _rev?: string;
  title: string;
  description: string;
  datetime: string;
}
