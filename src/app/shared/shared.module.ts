import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedRoutingModule,
    RouterModule,
    MaterialModule,
  ],
  exports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]

})
export class SharedModule { }
