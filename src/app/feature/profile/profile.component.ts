import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileStateModel, ProfileState } from '@wl-core/states/profile.state';
import { WLPlan } from '../plan/plan.model';
import { WLProfileActions } from '@wl-core/actions/profile.actions';
import { PostService } from '../post/post.service';
import { WLPost } from '../post/post.model';
import { WlUser } from '@wl-core/models/user.model';
import { take, tap, takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  @ViewChild('mapRef', {static: true}) mapref: ElementRef;
  @Select() profile$: Observable<ProfileStateModel>;
  map: google.maps.Map;
  plan: WLPlan;
  posts: WLPost[] = [];
  likedPosts: Promise<string[]>;
  lastPost: any = {
    author: null,
    comments: null,
    date: null,
    description: null,
    followers: null,
    id: null,
    likes: null,
    photoURLs: null,
  };
  loaded = false;
  noMorePosts = false;
  uid: string;

  constructor(private store: Store, private ps: PostService, private cd: ChangeDetectorRef) {
  }
  @HostListener('scroll', ['$event.target'])
  onElementScroll(elem): void {
    if ((elem.offsetHeight + elem.scrollTop * 1.1) >=  elem.scrollHeight && !this.loaded && !this.noMorePosts) {

      this.loaded = true;
      this.loadUserPosts();
      setTimeout(() => this.loaded = false, 2000);
    }
  }

   loadUserPosts() {
    this.ps.loadUserPosts(this.uid, this.lastPost).then(docs => {
      if (docs.length === 0 ){
        this.noMorePosts = true;
        this.cd.detectChanges();
        return;
      }
      this.lastPost = docs[docs.length - 1];
      docs.map(doc => this.posts.push(WLPost.deserialize(doc)));
      this.cd.detectChanges();
    });
  }


  ngOnInit(): void {
    this.likedPosts = this.ps.getLikedPosts();
    this.map = new google.maps.Map(this.mapref.nativeElement, {zoom: 12, center: {lat: 46, lng: 21}});
    const sub = this.profile$.subscribe(profile =>{
      if (profile.user !== null) {
        this.uid = profile.user.uid;
        this.loadUserPosts();
        sub.unsubscribe();
      }
    })
  }

  follow() {
    this.store.dispatch(new WLProfileActions.Set.Followed(true));
  }

  unfollow() {
    this.store.dispatch(new WLProfileActions.Set.Followed(false));
  }

  async likeEventReciever(event: {post: WLPost, isLike: boolean}) {
    event.isLike ? this.ps.like(event.post) : this.ps.dislike(event.post);
  }

}
