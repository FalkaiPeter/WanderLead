import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceGroupComponent } from './price-group.component';
import { MaterialModule } from '@wl-shared/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [PriceGroupComponent],
  imports: [
    CommonModule,
    MaterialModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PriceGroupComponent
  ]
})
export class PriceGroupModule { }
