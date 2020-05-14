import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngxs/store';
import { WlUser } from '@wl-core/models/user.model';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { finalize, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadTaskComponent implements OnInit {
  @Input() file: File;
  @Output() uploaded = new EventEmitter<string>();
  @Output() remove = new EventEmitter<{url: string, name: string}>();
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  userUid: string = this.store.selectSnapshot(CurrentUserState).uid;
  deleted = false;

  constructor(private storage: AngularFireStorage, private store: Store, public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    const path = `Posts/${this.userUid}/images/${Date.now()}_${this.file.name}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, this.file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.uploaded.emit(this.downloadURL);
      })
    );
  }

  deleteUploadedFile(){
    this.storage.storage.refFromURL(this.downloadURL).delete();
    this.remove.emit({url: this.downloadURL, name: this.file.name});
    this.deleted = true;
  }


}
