import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth, firestore } from 'firebase/app';
import { NgForm, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CurrentUserActions } from '@wl-core/actions/current-user.actions';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { NotificationState } from '@wl-core/states/notifications.state';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  basicPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/wanderlead-fcd29.appspot.com/o/blank-profile-picture.svg?alt=media&token=ef42ff39-cbf8-4cf8-8b3a-6c45fbc0a2a2';
  constructor(private afauth: AngularFireAuth, private db: AngularFirestore, private router: Router, private store: Store) { }

  async signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    const popup = (await this.afauth.auth.signInWithPopup(provider));
    const user = popup.user;
    if (popup.additionalUserInfo.isNewUser) {
      user.updateProfile({photoURL: this.basicPhotoURL});
      this.addUserDataToDB(user.uid, user.displayName, user.email);
    }
    this.store.dispatch(new CurrentUserActions.SetByModel({uid: user.uid, displayName: user.displayName, photoURL: this.basicPhotoURL}));
    this.router.navigate(['/home']);
  }

  signIn(data: FormGroup) {
    this.afauth.auth.signInWithEmailAndPassword(data.value.email, data.value.password).then(result =>{
      this.store.dispatch(
        new CurrentUserActions.SetByModel(
          {uid: result.user.uid,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          })
      );
      this.router.navigate(['/home']);
    })
    .catch(error => alert('Wrong Eamil or Password'));
  }

  async signUp(data) {
    /* name formatting */
    const displayName = this.nameFormatter(data.firstname, data.lastname);
    const user = (await this.afauth.auth.createUserWithEmailAndPassword(data.email, data.password)).user;
    this.store.dispatch(new CurrentUserActions.SetByModel({uid: user.uid, photoURL: this.basicPhotoURL, displayName}));
    user.updateProfile({ displayName, photoURL: this.basicPhotoURL });
    this.addUserDataToDB(user.uid, displayName, user.email);
    this.router.navigate(['/home']);
  }

  signOut(){
    navigator.sendBeacon('https://us-central1-wanderlead-fcd29.cloudfunctions.net/last_logout', this.store.snapshot().currentUser.uid);
    this.store.reset([CurrentUserState, NotificationState]);
    this.afauth.auth.signOut();
    this.router.navigate(['/login']);
  }

  addUserDataToDB(uid: string, displayName: string, email: string){
    const photoURL = this.basicPhotoURL;
    const batch = this.db.firestore.batch();
    const baseRef = this.db.doc(`Users/${uid}`);
    const publicRef = this.db.doc(`Users/${uid}/other/public`);
    const privateRef = this.db.doc(`Users/${uid}/other/private`);
    const plansRef = this.db.doc(`Plans/${uid}`);
    const followingRef = this.db.doc(`Users/${uid}/followings/idList`);

    batch.set(baseRef.ref, {uid, displayName, photoURL});
    batch.set(privateRef.ref, {uid, email});
    batch.set(publicRef.ref, {uid, displayName, photoURL, followers: 0, followings: 0, trips: 0, bio: '', plans: []});
    batch.set(plansRef.ref, {public: [], private: []});
    batch.set(followingRef.ref, {idList: []});
    batch.set(baseRef.collection('LikedPosts').doc(this.db.createId()).ref, {idList: []});
    return batch.commit().catch(error => console.log(error));
  }

  nameFormatter(firstname: string, lastname: string) {
    const f = `${firstname.charAt(0).toUpperCase()}${firstname.slice(1)}`;
    const l = `${lastname.charAt(0).toUpperCase()}${lastname.slice(1)}`;
    return `${f} ${l}`;
  }
}
