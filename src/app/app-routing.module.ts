import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'icard',  
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'nurse-dashboard',
    loadChildren: () => import('./pages/nurse-dashboard/nurse-dashboard.module').then( m => m.NurseDashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-patient',
    loadChildren: () => import('./pages/add-patient/add-patient.module').then( m => m.AddPatientPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-appointment',
    loadChildren: () => import('./pages/add-appointment/add-appointment.module').then( m => m.AddAppointmentPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'spo2',
    loadChildren: () => import('./pages/spo2/spo2.module').then( m => m.Spo2PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'stathoscope',
    loadChildren: () => import('./pages/stathoscope/stathoscope.module').then( m => m.StathoscopePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'launch-icare',
    loadChildren: () => import('./pages/launch-icare/launch-icare.module').then( m => m.LaunchIcarePageModule)
  },
  {
    path: 'icard',
    loadChildren: () => import('./pages/icard/icard.module').then( m => m.IcardPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
