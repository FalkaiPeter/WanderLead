import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngxs/store';
import { CurrentUserActions } from '@wl-core/actions/current-user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor( private updates: SwUpdate, private store: Store) {
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
    if(!window.performance.navigation.TYPE_RELOAD)
    navigator.sendBeacon('https://us-central1-wanderlead-fcd29.cloudfunctions.net/last_logout', this.store.snapshot().currentUser.uid);
  }
}
