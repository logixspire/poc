import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaunchIcarePage } from './launch-icare.page';

const routes: Routes = [
  {
    path: '',
    component: LaunchIcarePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaunchIcarePageRoutingModule {}
