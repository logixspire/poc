import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Spo2Page } from './spo2.page';

const routes: Routes = [
  {
    path: '',
    component: Spo2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Spo2PageRoutingModule {}
