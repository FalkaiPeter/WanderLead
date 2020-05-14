import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploaderComponent {
  show = false;
  isHovering: boolean;
  files: File[] = [];
  downloadUrls: string[] = [];
  @Output() allTaskCompleted = new EventEmitter<string[]>();

  constructor(public cd: ChangeDetectorRef) {}

  toggleHover(event: boolean){
     this.isHovering = event;
     if (event) {
      this.show = true;
     }
  }
  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  taskCompleted(event: any) {
    this.downloadUrls.push(event);
    if ( this.files.length === this.downloadUrls.length) {
      this.allTaskCompleted.emit(this.downloadUrls);
    }
  }

  removeUploadedImage(event: {name: string, url: string}) {
    const urlIndex = this.downloadUrls.findIndex(item => item === event.url);
    const fileIndex = this.files.findIndex(item => item.name === event.name);
    this.files.splice(fileIndex, 1);
    this.downloadUrls.splice(urlIndex, 1);
    if(this.files.length === 0) {
      this.show = false;
    }
  }

  trackByfnc(index, item){
    return item.name;
  }

}
