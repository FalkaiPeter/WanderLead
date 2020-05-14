import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { WLPost, WLComment } from './post.model';
import { error } from '@angular/compiler/src/util';
import { Store } from '@ngxs/store';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { WlUser } from '@wl-core/models/user.model';
import { NgForm } from '@angular/forms';
import { PostService } from './post.service';
import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
  @Input() post: WLPost;
  @Output() likeEvent = new EventEmitter<{post: WLPost, isLike: boolean}>();
  @Input() liked: boolean;
  user: WlUser.Min = this.store.selectSnapshot(CurrentUserState);
  showComments = false;
  comments: WLComment[] = [];
  commentCount: number = null;
  last: any = {
    author: null,
    date: null,
    description: null,
  };


  constructor(private store: Store, private ps: PostService, private changeDetector: ChangeDetectorRef, private afs: AngularFirestore) { }

  ngOnInit() {
    if (this.post === undefined) {
      throw error('post is required input');
    }
    if (this.liked === undefined) {
      throw error('liked is required input');
    }
    this.afs.doc(this.post.comments).valueChanges().subscribe((a: any) => this.commentCount = a.count );
  }

  openComments(){
    this.showComments = !this.showComments;
    if ( this.comments.length === 0 && this.last !== undefined) {
      this.loadComment();
    }
  }

  addComment(form: NgForm) {
    if (form.value.description.length > 0 ) {
      this.ps.addComment(
        {
          date: moment.utc(),
          author: this.user,
          description: form.value.description,
        },
        this.post
        );
      }
    form.reset();
  }
  likeChange(post: WLPost) {
    this.liked = !this.liked;
    this.likeEvent.emit({post, isLike: this.liked});
  }

  async loadComment() {
    const docs = (await this.ps.loadComment(this.post, this.last));
    this.last = docs[docs.length - 1];
    this.comments = this.comments.concat(docs.map(doc => {
      return {
        author: doc.data().author,
        date: moment(doc.data().date),
        description: doc.data().description
      };
    }));
    this.changeDetector.detectChanges();
  }

}
