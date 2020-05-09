import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post/post.service';
import { Store } from '@ngxs/store';
import { WlUser } from '@wl-core/models/user.model';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { WLPost } from '../post/post.model';
import * as moment from 'moment';

@Component({
  selector: 'app-post-creator',
  templateUrl: './post-creator.component.html',
  styleUrls: ['./post-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostCreatorComponent  {
  user: WlUser.Min;

  constructor(private ps: PostService, private store: Store) {
    const state =this.store.selectSnapshot(CurrentUserState);
    this.user = {
      uid: state.uid,
      photoURL: state.photoURL,
      displayName: state.displayName,
    }
  }


  createPost(form: NgForm) {
    if (form.value.description.length > 0){
      this.ps.publish(new WLPost(null, this.user, moment.utc(), form.value.description))
      form.resetForm();
    }
  }

}
