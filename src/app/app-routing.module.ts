import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent }      from './components/files/files.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard }                from './guards/auth.guard';
import { LoggedInGuard }                from './guards/logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: FilesComponent, canActivate: [AuthGuard] },
  { path: 'directory/:id', component: FilesComponent, canActivate: [AuthGuard] },
  { path: 'files/search', component: FilesComponent, canActivate: [AuthGuard] },
  { path: 'shared-with-me', component: FilesComponent, canActivate: [AuthGuard] },
  { path: 'register', component: UserRegistrationComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}