import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Spo2PageRoutingModule } from './spo2-routing.module';
 import { NgChartsModule } from 'ng2-charts';
import { Spo2Page } from './spo2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Spo2PageRoutingModule,
    NgChartsModule
  ],
  declarations: [Spo2Page]
})
export class Spo2PageModule {}
