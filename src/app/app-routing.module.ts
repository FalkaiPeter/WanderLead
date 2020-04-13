import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './blocks/shell/shell.component';
import { redirectUnauthorizedTo, redirectLoggedInTo, AuthPipe, AuthPipeGenerator, AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { NotFoundComponent } from './blocks/not-found/not-found.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectAuthorisedToHome = () => redirectLoggedInTo(['home']);
const canActivate = (authGuardPipe: AuthPipe | AuthPipeGenerator) => ({
  canActivate: [AngularFireAuthGuard],
  data: { authGuardPipe },
});


const routes: Routes = [
  { path: '', component: ShellComponent,...canActivate(redirectUnauthorizedToLogin), children: [
    { path: 'home', loadChildren: () => import('./feature/home/home.module').then(m => m.HomeModule) },
    { path: 'profile', loadChildren: () => import('./feature/profile/profile.module').then(m => m.ProfileModule) },
    { path: 'discover', loadChildren: () => import('./feature/discover/discover.module').then(m => m.DiscoverModule) },
    { path: 'planning', loadChildren: () => import('./feature/planning/planning.module').then(m => m.PlanningModule) },
    { path: '', redirectTo: 'home', pathMatch: 'full'},
  ]},
  // tslint:disable-next-line: max-line-length
  { path: 'login', ...canActivate(redirectAuthorisedToHome), loadChildren: () => import('./feature/login/login.module').then(m => m.LoginModule) },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
