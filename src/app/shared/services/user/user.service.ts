import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { WlUser } from '@wl-core/models/user.model';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  setById(uid: string): Promise<WlUser.Public> {
    return this.afs.firestore
    .doc(`Users/${uid}/other/public`)
    .get()
    .then(result => result.data() as WlUser.Public);
  }

  isFollowed(currentUserID: string, uid: string): Promise<boolean | null> {
    if (currentUserID === uid)
      return null;
    return this.afs.firestore
    .doc(`Users/${currentUserID}/followings/${uid}`)
    .get()
    .then(result => result.exists);
  }

  follow( currentUser: WlUser.Min, user: WlUser.Min) {
    const batch = this.afs.firestore.batch();
    const followingRef = this.afs.firestore.doc(`Users/${currentUser.uid}/followings/${user.uid}`);
    const followersRef = this.afs.firestore.doc(`Users/${user.uid}/followers/${currentUser.uid}`);
    const userPublicRef = this.afs.firestore.doc(`Users/${user.uid}/other/public`);
    const currentPublicRef = this.afs.firestore.doc(`Users/${currentUser.uid}/other/public`);
    const increment = firestore.FieldValue.increment(1);

    batch.set(followingRef, user);
    batch.set(followersRef, currentUser);
    batch.set(currentPublicRef, {followings: increment}, {merge: true});
    batch.set(userPublicRef, {followers: increment}, {merge: true});
    return batch.commit().catch(error => console.log(error));
  }

  unfollow( currentUser: WlUser.Min, user: WlUser.Min) {
    const batch = this.afs.firestore.batch();
    const followingRef = this.afs.firestore.doc(`Users/${currentUser.uid}/followings/${user.uid}`);
    const followersRef = this.afs.firestore.doc(`Users/${user.uid}/followers/${currentUser.uid}`);
    const userPublicRef = this.afs.firestore.doc(`Users/${user.uid}/other/public`);
    const currentPublicRef = this.afs.firestore.doc(`Users/${currentUser.uid}/other/public`);
    const decrement = firestore.FieldValue.increment(-1);

    batch.delete(followingRef);
    batch.delete(followersRef);
    batch.set(currentPublicRef, {followings: decrement}, {merge: true});
    batch.set(userPublicRef, {followers: decrement}, {merge: true});
    return batch.commit().catch(error => console.log(error));
  }

  getUserCollection(uid: string, collection: string): Promise<any[]> {
    return this.afs.firestore
    .collection(`Users/${uid}/${collection}`)
    .get()
    .then(result => {
      const data = [];
      result.forEach(doc => data.push(doc.data()));
      return data;
    });
  }
}
