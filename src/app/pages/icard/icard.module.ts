import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IcardPageRoutingModule } from './icard-routing.module';

import { IcardPage } from './icard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IcardPageRoutingModule
  ],
  declarations: [IcardPage]
})
export class IcardPageModule {}
