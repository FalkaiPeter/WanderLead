import { Component, HostListener, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NgxsOnInit, Store, StateContext } from '@ngxs/store';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { CurrentUserActions } from '@wl-core/actions/current-user.actions';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, NgxsOnInit {

  constructor( private updates: SwUpdate, private store: Store, private afs: AngularFirestore) {
    updates.available.subscribe(() => updates.activateUpdate().then(() => window.location.reload()));
  }
  ngxsOnInit(ctx?: StateContext<any>) {
    console.log('asd');
  }
  ngOnInit(): void {
    this.store.dispatch(new CurrentUserActions.SetFromBackend());
    this.afs.collection('Users').stateChanges().subscribe(a => a.forEach(b => console.log(b.payload)));
  }



  @HostListener('window:beforeunload')
  onCloseTab() {
    if (window.performance.navigation.TYPE_RELOAD)
      localStorage.setItem('last_close', Date.now().toString());
  }

  @HostListener('window:unload')
  logData() {
    navigator.sendBeacon('https://us-central1-wanderlead-fcd29.cloudfunctions.net/lastLogout', this.store.snapshot().currentUser.uid);
  }
}
