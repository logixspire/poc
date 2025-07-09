import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import { generateUUIDv4 } from 'src/shared/utils';



@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private db: PouchDB.Database;
  private remoteCouch = 'https://your-api-host:5984/reminders';

  patients: mPatient[] = [];
  newpatient: mPatient = { _id:'',firstName: '', lastName: '', dateOfBirth: '', gender: '', phoneNumber: '', email: '', address: '', emergencyContactName: '', emergencyContactPhone: '', bloodGroup: ''}; 
  constructor() {
    this.db = new PouchDB('patients');
    // this.syncWithCouchDB();
  }

  private syncWithCouchDB() {
    this.db.sync(this.remoteCouch, {
      live: true,
      retry: true
    }).on('change', info => console.log('Sync Change:', info));
  }

  async getAllPatient(): Promise<mPatient[]> {
    return this.db.allDocs({ include_docs: true }).then(res => res.rows.map(r => r.doc as mPatient));
  }

  addPatient(patient: any) {
    patient._id = generateUUIDv4()  ;
    return this.db.put(patient);
  }

  updatePatient(patient: any) {
    return this.db.put(patient);
  }

  deletePatient(patient: any) {
    return this.db.remove(patient);
  }

  getPatient(id: string) {
    return this.db.get(id);
  }

  async syncToAPI(): Promise<void> {
    try {
      const result = await this.db.find({
        selector: {
          type: 'patients',
          synced: { $ne: true },
        }
      });

      for (const patient of result.docs) {
        const response = await fetch('https://your-api-url.com/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patient),
        });

        if (response.ok) {
          // patient.synced = true;
          await this.updatePatient(patient);
        }
      }

      console.log('Background sync completed');
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }
}

export interface mPatient {
  _id?: string;
  _rev?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601 date string (e.g., "2025-06-15")
  gender: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  isSync?:boolean

  // vitals: string
}


export class Vitals{
  _id: string="";
  details: string = ''
  patient_id:string = ''
}