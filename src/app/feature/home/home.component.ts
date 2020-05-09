import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener, } from '@angular/core';
import { WLPost } from '../post/post.model';
import { PostService } from '../post/post.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  posts: WLPost[] =[];
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

  @HostListener('scroll', ['$event.target'])
  onElementScroll(elem): void {
    if ((elem.offsetHeight + elem.scrollTop*1.1) >=  elem.scrollHeight && !this.loaded && !this.noMorePosts) {
      this.loaded = true;
      this.loadNewsFeed();
      setTimeout(() => this.loaded = false, 2000);
    }
  }
  constructor(private ps: PostService, private cd: ChangeDetectorRef) {
  }
  ngOnInit()  {
    this.likedPosts = this.ps.getLikedPosts();
    this.loadNewsFeed();
  }

  async likeEventReciever(event: {post: WLPost, isLike: boolean}) {
    event.isLike ? this.ps.like(event.post) : this.ps.dislike(event.post);
  }

  loadNewsFeed() {
    this.ps.loadNewsFeed(this.lastPost).then(docs => {
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




}
