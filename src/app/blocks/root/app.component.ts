import { Component, HostListener, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngxs/store';
import { CurrentUserActions } from '@wl-core/actions/current-user.actions';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor( private updates: SwUpdate, private store: Store) {
    updates.available.subscribe(() => updates.activateUpdate().then(() => window.location.reload()));
    // Load google maps script after view init
    const DSLScript = document.createElement('script');
    DSLScript.src = `https://maps.googleapis.com/maps/api/js?key=${environment.firebaseConfig.apiKey}&libraries=places, geometry`;
    DSLScript.type = 'text/javascript';
    document.body.appendChild(DSLScript);
    document.body.removeChild(DSLScript);
  }

  ngOnInit(): void {
    this.store.dispatch(new CurrentUserActions.SetFromBackend());
  }
}
