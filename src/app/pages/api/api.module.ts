import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApiPageRoutingModule } from './api-routing.module';

import { ApiPopoverComponent } from './api-popover.component';
import { ApiPage } from './api.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApiPageRoutingModule
  ],
  declarations: [
    ApiPopoverComponent,
    ApiPage,
  ],
  bootstrap: [
    ApiPopoverComponent,
  ]
})
export class ApiPageModule { }
