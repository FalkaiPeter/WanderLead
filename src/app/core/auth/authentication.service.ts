import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { NgForm } from '@angular/forms';
import { Store } from '@ngxs/store';
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
    if (popup.additionalUserInfo.isNewUser) {
      await popup.user.updateProfile({photoURL: this.basicPhotoURL});
    }
    this.router.navigate(['/home']);
  }

  async signIn(data: NgForm) {
    await this.afauth.auth.signInWithEmailAndPassword(data.value.email, data.value.password);
    this.router.navigate(['/home']);
  }

  async signUp(data) {
    /* name formatting */
    const displayName = `${data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1)} ${data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1)}`;
    /* register user */
    const user = (await this.afauth.auth.createUserWithEmailAndPassword(data.email, data.password)).user;
    /* update profile with new data */
    user.updateProfile({ displayName, photoURL: this.basicPhotoURL });
    /* add user name to db cuz cloud function insert null on user name */
    this.db.doc(`Users/${user.uid}`).set({displayName}, {merge: true});
    this.router.navigate(['/home']);
  }

  signOut(){
    this.store.reset([CurrentUserState, NotificationState]);
    this.afauth.auth.signOut();
    this.router.navigate(['/login']);

  }
}
