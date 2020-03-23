import { Component, HostListener } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor( private updates: SwUpdate) {
    updates.available.subscribe(() => updates.activateUpdate().then(() => window.location.reload()));
  }



  @HostListener('window:beforeunload')
  onCloseTab() {
    if (window.performance.navigation.TYPE_RELOAD)
      localStorage.setItem('last_close', Date.now().toString());
  }
}
