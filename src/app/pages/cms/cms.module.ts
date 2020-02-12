import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CmsPageRoutingModule } from './cms-routing.module';

import { CmsPage } from './cms.page';
import { CmsGrantPage } from './cms-grant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CmsPageRoutingModule
  ],
  declarations: [
    CmsPage,
    CmsGrantPage,
  ]
})
export class CmsPageModule { }
