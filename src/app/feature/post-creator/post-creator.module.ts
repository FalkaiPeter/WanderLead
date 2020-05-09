import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCreatorComponent } from './post-creator.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@wl-shared/material.module';



@NgModule({
  declarations: [PostCreatorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    PostCreatorComponent
  ]
})
export class PostCreatorModule { }
