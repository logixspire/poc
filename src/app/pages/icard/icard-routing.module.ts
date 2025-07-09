import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IcardPage } from './icard.page';

const routes: Routes = [
  {
    path: '',
    component: IcardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IcardPageRoutingModule {}
