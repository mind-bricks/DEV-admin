import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module')
        .then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module')
        .then(m => m.HomePageModule)
  },
  {
    path: 'cms',
    loadChildren: () =>
      import('./pages/cms/cms.module')
        .then(m => m.CmsPageModule)
  },
  {
    path: 'api',
    loadChildren: () =>
      import('./pages/api/api.module')
        .then(m => m.ApiPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { preloadingStrategy: PreloadAllModules }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
