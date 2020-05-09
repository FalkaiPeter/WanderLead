import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderComponent } from './image-uploader.component';
import { DropZoneDirective } from './drop-zone.directive';



@NgModule({
  declarations: [ImageUploaderComponent, DropZoneDirective],
  imports: [
    CommonModule
  ]
})
export class ImageUploaderModule { }
