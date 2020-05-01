import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceGroupComponent } from './place-group.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MaterialModule } from '@wl-shared/material.module';
import { ColorPhotoshopModule } from 'ngx-color/photoshop';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [PlaceGroupComponent],
  imports: [
    CommonModule,
    MaterialModule,
    DragDropModule,
    ColorPhotoshopModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PlaceGroupComponent,
  ]
})
export class PlaceGroupModule { }
