import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngxs/store';
import { CurrentUserActions } from '@wl-core/actions/current-user.actions';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor( private updates: SwUpdate, private store: Store, private afs: AngularFirestore) {
    updates.available.subscribe(() => updates.activateUpdate().then(() => window.location.reload()));
  }
  ngOnInit(): void {
    this.store.dispatch(new CurrentUserActions.SetFromBackend());
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