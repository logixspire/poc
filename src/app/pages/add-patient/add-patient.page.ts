import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { mPatient, PatientService } from 'src/app/services/patient.service';
import { PouchdbService } from 'src/app/services/pouchdb.service';



export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.page.html',
  styleUrls: ['./add-patient.page.scss'],
  standalone: false
})
export class AddPatientPage implements OnInit {

  showDatePopover = false;
  datePopoverEvent: any;

  genders = Object.values(Gender);
  bloodGroups = Object.values(BloodGroup);

  constructor(public patientService: PatientService, private router: Router) { 
    
  }

  ngOnInit() {
    this.loadReminders();
    // this.dbService.sync('http://localhost:5984/reminders');
  }

  openDatePicker(ev: any) {
    this.datePopoverEvent = ev;
    this.showDatePopover = true;
  }

  async loadReminders() {
    this.patientService.patients = await this.patientService.getAllPatient();
    console.log(this.patientService.patients)
  }

  async savePatients() {
    if (this.patientService.newpatient._id) {
      await this.patientService.updatePatient(this.patientService.newpatient);
    } else {
      await this.patientService.addPatient(this.patientService.newpatient);
      // const date = new Date(this.patientService.newpatient.remindAt);
      // await this.patientService.scheduleNotification(
      //   this.patientService.newpatient.address,
      //   this.patientService.newpatient.bloodGroup,
      //   date,
      //   Math.floor(Math.random() * 100000)
      // );
    }

    this.patientService.newpatient = { _id: '', firstName: '', lastName: '', dateOfBirth: '', gender: '', phoneNumber: '', email: '', address: '', emergencyContactName: '', emergencyContactPhone: '', bloodGroup: '' };
    this.patientService.patients = await this.patientService.getAllPatient()
    this.router.navigate(['/nurse-dashboard'])
    this.loadReminders();
  }

  editPatients(patients: mPatient) {
    this.patientService.newpatient = { ...patients };
  }

  async delete(patients: mPatient) {
    await this.patientService.deletePatient(patients);
    this.loadReminders();
  }
}
