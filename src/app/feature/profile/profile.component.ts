import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ProfileStateModel } from '@wl-core/states/profile.state';
import { Observable } from 'rxjs';
import { UserService } from '@wl-shared/services/user/user.service';
import { WLProfileActions } from '@wl-core/actions/profile.actions';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  @ViewChild('asd', {static: true}) map: ElementRef;
  @Select() profile$: Observable<ProfileStateModel>;
  mapOpened;
  aboutOpened = false;
  isMobile$;
  isFullscreen = false;


  /* A CONSTRUCTOR BEALLITJA AZT HOGY HA MOBILON (<=425PX) VAN AZ OLDAL AKKOR A MAP NE JELENJEN MEG ALAPBOL */
  constructor(private store: Store, private userService: UserService, breakpointObserver: BreakpointObserver, private afs: AngularFirestore) {
    this.isMobile$ = breakpointObserver.observe(['(max-width: 425px)']).pipe(map(result => result.matches));
    this.isMobile$.subscribe(result => this.mapOpened = !result);
  }

  ngOnInit() {
  }
 /* FALSERA ALLITJA AZ ABOOUTOT, ES HA A MAP NINCS MEGNYITVA AKKOR MEGNYITJA, ELLENKEZP ESETBEN BEZARJA AZT */
  openMap() {
    this.aboutOpened = false;
    this.mapOpened ? this.mapOpened = false : this.mapOpened = true;
  }
  /* SAME AS MAP CSAK ABOUTRA */
  openAbout() {
    this.mapOpened = false;
    this.aboutOpened ? this.aboutOpened = false : this.aboutOpened = true;
  }

  follow() {
    this.store.dispatch(new WLProfileActions.Set.Followed(true));
  }

  unfollow() {
    this.store.dispatch(new WLProfileActions.Set.Followed(false));
  }


  loadPlan() {
    console.log('asd')
  }

}
