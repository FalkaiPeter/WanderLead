import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post/post.service';
import { Store } from '@ngxs/store';
import { WlUser } from '@wl-core/models/user.model';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { WLPost } from '../post/post.model';
import * as moment from 'moment';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-creator',
  templateUrl: './post-creator.component.html',
  styleUrls: ['./post-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostCreatorComponent  {
  user: WlUser.Min;
  downloadURLs: string[];
  @ViewChild(ImageUploaderComponent, {static: true}) uploaderCom: ImageUploaderComponent;

  constructor(private ps: PostService, private store: Store, private renderer: Renderer2, private eRef: ElementRef, private _snackbar: MatSnackBar) {
    const state = this.store.selectSnapshot(CurrentUserState);
    this.user = {
      uid: state.uid,
      photoURL: state.photoURL,
      displayName: state.displayName,
    };
  }


  createPost(form: NgForm) {
    if (form.value.description.length > 0 || this.downloadURLs) {
      this.ps.publish(new WLPost(null, this.user, moment.utc(), form.value.description, this.downloadURLs ? this.downloadURLs : []));
      this.downloadURLs =[];
      this.uploaderCom.files = [];
      this.uploaderCom.show = false;
      this.uploaderCom.cd.detectChanges();
      form.resetForm();
      this._snackbar.open('Post published sucesfully!', '', {duration: 2000, verticalPosition: 'top', panelClass: 'snackbar'});
    }
  }

  hideOnClickOutside() {
    let listener: () => void;
    this.uploaderCom.show = true;
    this.uploaderCom.cd.detectChanges();
    listener = this.renderer.listen('window', 'click', (event) =>{
      if (!this.eRef.nativeElement.contains(event.target) && event.target.id !== 'deleteTask') {
        this.uploaderCom.show = false;
        this.uploaderCom.cd.detectChanges();
        listener();
      }
    });
  }
}
