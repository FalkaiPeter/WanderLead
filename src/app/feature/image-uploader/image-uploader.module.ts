import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent } from './image-uploader.component';
import { DropZoneDirective } from './drop-zone.directive';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { MaterialModule } from '@wl-shared/material.module';



@NgModule({
  declarations: [ImageUploaderComponent, DropZoneDirective, UploadTaskComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ImageUploaderComponent
  ]
})
export class ImageUploaderModule { }
