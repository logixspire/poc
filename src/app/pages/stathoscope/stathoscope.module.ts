import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StathoscopePageRoutingModule } from './stathoscope-routing.module';

import { StathoscopePage } from './stathoscope.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StathoscopePageRoutingModule
  ],
  declarations: [StathoscopePage]
})
export class StathoscopePageModule {}
