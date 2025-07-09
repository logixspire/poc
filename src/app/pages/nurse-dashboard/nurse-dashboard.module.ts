import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NurseDashboardPageRoutingModule } from './nurse-dashboard-routing.module';

import { NurseDashboardPage } from './nurse-dashboard.page';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NurseDashboardPageRoutingModule,
    LayoutModule
  ],
  declarations: [NurseDashboardPage]
})
export class NurseDashboardPageModule {}
