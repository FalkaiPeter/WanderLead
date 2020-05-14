import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCreatorComponent } from './post-creator.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@wl-shared/material.module';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';



@NgModule({
  declarations: [PostCreatorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ImageUploaderModule,
    MaterialModule,
  ],
  exports: [
    PostCreatorComponent
  ]
})
export class PostCreatorModule { }
