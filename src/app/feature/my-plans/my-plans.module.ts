import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPlansRoutingModule } from './my-plans-routing.module';
import { MyPlansComponent } from './my-plans.component';
import { MaterialModule } from '@wl-shared/material.module';
import { PlanModule } from '../plan/plan.module';


@NgModule({
  declarations: [MyPlansComponent],
  imports: [
    CommonModule,
    MyPlansRoutingModule,
    MaterialModule,
    PlanModule
  ]
})
export class MyPlansModule { }
