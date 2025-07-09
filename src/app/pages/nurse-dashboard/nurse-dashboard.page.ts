import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { mPatient, PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-nurse-dashboard',
  templateUrl: './nurse-dashboard.page.html',
  styleUrls: ['./nurse-dashboard.page.scss'],
  standalone: false
})
export class NurseDashboardPage implements OnInit {

  isWeb = false;

  constructor(public patientService: PatientService, private bp: BreakpointObserver, public router: Router) {
    this.initBackgroundSync();
  }

  initBackgroundSync() {
    this.patientService.syncToAPI(); // First run on load

    setInterval(() => {
      this.patientService.syncToAPI(); // Run every 60 seconds
    }, 60000);
  }

  async ngOnInit() {
    this.bp.observe([Breakpoints.Handset]).subscribe((result: any) => {
      this.isWeb = !result.matches;
    });

    this.patientService.patients = await this.patientService.getAllPatient()
    console.log(this.patientService.patients)
  }

  addPatient() {
    // navigate
    this.router.navigate(['/add-patient'])
  }

  openAppointment(patient: any) {
    this.router.navigate(['/add-appointment'])
  }

  editPatient(patient: any) {
    this.patientService.newpatient = { ...patient };
    console.log(this.patientService.newpatient)
    this.router.navigate(['/add-patient'])
    // Open form pre-filled with `patient` data
  }

  async deletePatient(patient: any) {
    if (confirm(`Are you sure you want to delete ${patient.firstName}?`)) {
      // this.patientService.patients = this.patientService.patients.filter(p => p !== patient);
      // Optionally call API to delete from backend
      await this.patientService.deletePatient(patient);
      this.patientService.patients = await this.patientService.getAllPatient()
    }
  }

  openStethoscope(id: number) {
    // connect to device
    this.router.navigate(['/stathoscope'])
  }

  openSPO2(id: number) {
    // connect to device
    this.router.navigate(['/spo2'])
  }

  logout(){
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user-role')
    this.router.navigate(['/'])
  }

  openIcare(){
    this.router.navigate(['/launch-icare'])
  }
}
