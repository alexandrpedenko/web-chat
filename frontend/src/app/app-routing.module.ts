import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAuthorized } from '@shared/guards/authorized-activate.guard';
import { canActivateUnauthorized } from '@shared/guards/unauthorized-activate.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [ canActivateAuthorized ],
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [ canActivateUnauthorized ],
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
