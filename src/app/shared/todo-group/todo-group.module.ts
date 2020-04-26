import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoGroupComponent } from './todo-group.component';
import { MaterialModule } from '@wl-shared/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [TodoGroupComponent],
  imports: [
    CommonModule,
    MaterialModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    TodoGroupComponent
  ]
})
export class TodoGroupModule { }
