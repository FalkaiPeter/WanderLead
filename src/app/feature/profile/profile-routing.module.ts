import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { ProfileResolverService } from './profile-resolver.service';

const routes: Routes = [
  { path: ':uid', component: ProfileComponent, resolve: [ProfileResolverService]},
  { path: '', redirectTo: ':uid', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
