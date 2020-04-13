import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningComponent } from './planning.component';
import { AgmCoreModule } from '@agm/core';
import { NgxsModule } from '@ngxs/store';
import { PlanningState } from './planning.state';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@wl-shared/shared.module';


@NgModule({
  declarations: [PlanningComponent],
  imports: [
    CommonModule,
    PlanningRoutingModule,
    AgmCoreModule,
    NgxsModule.forFeature([PlanningState]),
    FormsModule,
    SharedModule
  ]
})
export class PlanningModule { }
