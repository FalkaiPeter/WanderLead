import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPlansComponent } from './my-plans.component';
import { MyPlansResolver } from './my-plans.resolver.service';

const routes: Routes = [{ path: '', component: MyPlansComponent, resolve: [MyPlansResolver]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPlansRoutingModule { }
