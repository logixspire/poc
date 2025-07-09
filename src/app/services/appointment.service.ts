import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb'; // ✅ Import the main PouchDB library
import PouchdbFind from 'pouchdb-find';

PouchDB.plugin(PouchdbFind); // ✅ Register the plugin after import

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

   private db = new PouchDB('appointments');

  constructor() {
    this.initIndexes();
  }

  async initIndexes() {
    await this.db.createIndex({ index: { fields: ['type'] } });
    await this.db.createIndex({ index: { fields: ['patientId'] } });
  }

  async addAppointment(appointment: any) {
    appointment._id = `appointment_${new Date().getTime()}`;
    appointment.type = 'appointment';
    return await this.db.put(appointment);
  }

  async getAppointmentsByPatient(patientId: string) {
    console.log(patientId)
    const result = await this.db.find({
      selector: { type: 'appointment', patientId }
    });
    return result.docs;
  }

  async deleteAppointment(appointment: any) {
    return await this.db.remove(appointment);
  }

  async getAllAppointments() {
    const result = await this.db.find({ selector: { type: 'appointment' } });
    return result.docs;
  }
}