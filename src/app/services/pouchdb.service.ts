import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import { mPatient } from './patient.service';

export interface Reminder {
  _id?: string;
  _rev?: string;
  title: string;
  description: string;
  remindAt: string; // ISO string
}



@Injectable({ providedIn: 'root' })
export class PouchdbService {
  private db = new PouchDB('reminders');

  addReminder(reminder: Reminder) {
    reminder._id = new Date().toISOString();
    return this.db.put(reminder);
  }

  getReminders(): Promise<Reminder[]> {
    console.log(this.db.allDocs({ include_docs: true }).then(res => res.rows.map(r => r.doc as Reminder)))
    return this.db.allDocs({ include_docs: true }).then(res => res.rows.map(r => r.doc as Reminder));
  }

  updateReminder(reminder: Reminder) {
    return this.db.put(reminder);
  }

  deleteReminder(reminder: Reminder) {
    // return this.db.remove(reminder);
  }

  sync(remoteUrl: string) {
    const remote = new PouchDB(remoteUrl);
    this.db.sync(remote, { live: true, retry: true });
  }

}
