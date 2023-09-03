import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './Components/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home', loadComponent: () =>
      import('src/app/Components/home/home.component')
        .then(m => m.HomeComponent),
  },
  {
    path: 'user/:id', loadComponent: () =>
      import('src/app/Components/user/user.component')
        .then(m => m.UserComponent),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
