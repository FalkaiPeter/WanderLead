import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan.component';
import { PlaceGroupModule } from '@wl-shared/place-group/place-group.module';
import { PriceGroupModule } from '@wl-shared/price-group/price-group.module';
import { TodoGroupModule } from '@wl-shared/todo-group/todo-group.module';
import { MaterialModule } from '@wl-shared/material.module';



@NgModule({
  declarations: [PlanComponent],
  imports: [
    CommonModule,
    PlaceGroupModule,
    PriceGroupModule,
    TodoGroupModule,
    MaterialModule,
  ],
  exports: [
    PlanComponent
  ]
})
export class PlanModule { }
