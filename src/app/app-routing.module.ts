import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdmissionPageComponent } from './admission-page/admission-page.component';

const routes: Routes = [
  {
    path: 'home',
    component: AdmissionPageComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
