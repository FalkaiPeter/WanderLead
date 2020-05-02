import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanningComponent } from './planning.component';
import { PlanningGuard } from './planning.guard';

const routes: Routes = [
  { path: ':id', component: PlanningComponent, canActivate: [PlanningGuard]},
  { path: '', component: PlanningComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule { }
