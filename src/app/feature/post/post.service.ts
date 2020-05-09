import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { WLPost, WLComment } from './post.model';
import { Store } from '@ngxs/store';
import { WlUser } from '@wl-core/models/user.model';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { firestore } from 'firebase/app';
import * as moment from 'moment';
import { from } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PostService {
  user: WlUser.Min;

  constructor(private afs: AngularFirestore, private store: Store) {
    this.user = this.store.selectSnapshot(CurrentUserState);
  }

  loadNewsFeed(last: any) {
    return this.afs.firestore.collection('Posts')
    .where('followers', 'array-contains', this.user.uid)
    .orderBy('date', 'desc')
    .startAfter(last)
    .limit(10)
    .get().then(coll => coll.docs);
  }

  async getLikedPosts(){
    const data = [];
    (await this.afs.firestore.collection(`Users/${this.user.uid}/LikedPosts`).get())
    .docs
    .forEach(doc => doc.data().idList.forEach(id => data.push(id)));
    return data;
  }

  async publish(post: WLPost) {
    if (post.id === null || post.id.length === 0)
    post.id = this.afs.createId();
    if (post.date === null)
    post.date = moment.utc();
    post.comments = (await (await this.afs.collection('Comments').add({count: 0})).get()).ref;
    post.likes = (await (await this.afs.collection('Likes').add({count: 0})).get()).ref;
    post.followers = (await this.afs.firestore.doc(`Users/${this.user.uid}/followers/idList`).get()).data().idList as string[];
    this.afs.collection('Posts')
    .add(WLPost.serialize(post))
    .then(
      () => console.log('Post published sucessfully!'),
      error => console.log('Something went wrong! ' + error)
    );
  }

  addComment(comment: WLComment, post: WLPost) {
    this.afs
    .doc(post.comments).collection('comments')
    .add({
      date: comment.date.toISOString(),
      author: comment.author,
      description: comment.description,
    });
    this.afs.doc(post.comments).update({count: firestore.FieldValue.increment(1)});
  }

  loadComment(post: WLPost, last: WLComment) {
    return this.afs.firestore
    .doc(post.comments.path)
    .collection('comments')
    .orderBy('date', 'desc')
    .startAfter(last)
    .limit(2)
    .get()
    .then(coll => coll.docs).catch();
  }

  async like(post: WLPost) {
    const batch = this.afs.firestore.batch();
    const coll = (await this.afs.firestore.collection(`Users/${this.user.uid}/LikedPosts`).get()).docs;

    batch.set(coll[coll.length - 1].ref, {idList: firestore.FieldValue.arrayUnion(post.id)});
    batch.update(this.afs.doc(post.likes).ref, {count: firestore.FieldValue.increment(1)} )
    batch.set(this.afs.doc(post.likes).collection('likes').doc(this.user.uid).ref, this.user );
    return batch.commit().catch(error => console.log(error));

  }
  async dislike(post: WLPost) {
    const batch = this.afs.firestore.batch();
    const doc1 = (await this.afs.firestore
      .collection(`Users/${this.user.uid}/LikedPosts`)
      .where('idList', 'array-contains', post.id)
      .get()).docs[0];

    const doc2 = (await this.afs.firestore
      .doc(post.likes.path)
      .collection('likes')
      .where('uid', '==', this.user.uid)
      .get()).docs[0];

    batch.update(doc1.ref, {idList: firestore.FieldValue.arrayRemove(post.id)});
    batch.update(post.likes, {count: firestore.FieldValue.increment(-1)});
    batch.delete(doc2.ref);
    return batch.commit().catch(error => console.log(error));
  }
}
