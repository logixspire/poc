import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.page.html',
  styleUrls: ['./add-appointment.page.scss'],
  standalone: false
})
export class AddAppointmentPage implements OnInit {

  showDatePopover = false;
  datePopoverEvent: any;

  appointment: any = {
    doctor: '',
    date: '',
    notes: '',
    patientId: ''
  };

  patients: any[] = [];
  filteredAppointments: any[] = [];

  constructor(private appointmentService: AppointmentService, public patientService: PatientService) { }

  async ngOnInit() {
    await this.requestPermission();
    const allPatients = await this.patientService.getAllPatient?.();
    this.patients = allPatients || [];
    console.log(this.patients)
  }

  
  async requestPermission() {
    const perm = await LocalNotifications.requestPermissions();
    console.log('Notification permission:', perm);
  }

  openDatePicker(ev: any) {
    this.datePopoverEvent = ev;
    this.showDatePopover = true;
  }

  async onPatientChange() {
    if (this.appointment.patientId) {
      this.filteredAppointments = await this.appointmentService.getAppointmentsByPatient(this.appointment.patientId);
    } else {
      this.filteredAppointments = [];
    }
  }

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p._id === patientId);
    if (!patient) return 'Unknown';
    return `${patient.firstName} ${patient.lastName}`;
  }

  async deleteAppointment(appt: any) {
    if (confirm(`Are you sure you want to delete appointment?`)) {
      await this.appointmentService.deleteAppointment(appt);
      await this.onPatientChange();
    }
  }

  async addAppointment() {
    if (!this.appointment.patientId) return alert('Select patient');

    await this.appointmentService.addAppointment(this.appointment);
    console.log(this.appointment)
    await this.scheduleNotification(this.appointment);
    alert('Appointment added & notification scheduled!');

    var id = this.appointment.patientId
    this.resetForm();
    this.appointment.patientId = id
    this.onPatientChange()
  }

  resetForm() {
    this.appointment = { doctor: '', date: '', notes: '', patientId: '' };
  }

  async scheduleNotification(appointment: any) {
    const appointmentTime = new Date(appointment.date).getTime();
    const now = new Date().getTime();
    const notifyTime = appointmentTime - 10 * 60 * 1000;

    if (notifyTime <= now) return;

    await LocalNotifications.schedule({
      notifications: [{
        id: Date.now(),
        title: 'Upcoming Appointment',
        body: `You have an appointment with ${appointment.doctor} in 10 minutes.`,
        schedule: { at: new Date(notifyTime) },
        // sound: null,
        smallIcon: 'res://icon',
        iconColor: '#488AFF',
      }]
    });
  }
}
