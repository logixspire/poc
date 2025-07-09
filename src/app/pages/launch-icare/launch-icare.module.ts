import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaunchIcarePageRoutingModule } from './launch-icare-routing.module';

import { LaunchIcarePage } from './launch-icare.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaunchIcarePageRoutingModule
  ],
  declarations: [LaunchIcarePage]
})
export class LaunchIcarePageModule {}
