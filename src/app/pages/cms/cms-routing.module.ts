import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmsPage } from './cms.page';
import { CmsGrantPage } from './cms-grant.page';

const routes: Routes = [
  {
    path: '',
    component: CmsPage,
  },
  {
    path: 'grant',
    component: CmsGrantPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsPageRoutingModule { }
