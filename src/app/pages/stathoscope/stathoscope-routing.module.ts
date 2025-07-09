import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StathoscopePage } from './stathoscope.page';

const routes: Routes = [
  {
    path: '',
    component: StathoscopePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StathoscopePageRoutingModule {}
