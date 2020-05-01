import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningComponent } from './planning.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@wl-shared/shared.module';
import { PlaceGroupModule } from '@wl-shared/place-group/place-group.module';
import { TodoGroupModule } from '@wl-shared/todo-group/todo-group.module';
import { PriceGroupModule } from '@wl-shared/price-group/price-group.module';
import { PlanModule } from '../plan/plan.module';

@NgModule({
  declarations: [PlanningComponent],
  imports: [
    CommonModule,
    PlanningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PlaceGroupModule,
    TodoGroupModule,
    PriceGroupModule,
    PlanModule
  ]
})
export class PlanningModule { }
