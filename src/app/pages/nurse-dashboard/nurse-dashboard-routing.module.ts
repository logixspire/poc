import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NurseDashboardPage } from './nurse-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: NurseDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NurseDashboardPageRoutingModule {}
