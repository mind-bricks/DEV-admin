import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CmsPageRoutingModule } from './cms-routing.module';
import { CmsCreateComponent } from './cms-create.component';
import { CmsPopoverComponent } from './cms-popover.component';
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
    CmsCreateComponent,
    CmsPopoverComponent,
    CmsPage,
    CmsGrantPage,
  ],
  bootstrap: [
    CmsCreateComponent,
    CmsPopoverComponent,
  ]
})
export class CmsPageModule { }
