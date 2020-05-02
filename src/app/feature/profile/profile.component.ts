import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileStateModel } from '@wl-core/states/profile.state';
import { WLPlan } from '../plan/plan.model';
import { WLProfileActions } from '@wl-core/actions/profile.actions';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  @ViewChild('mapRef', {static: true}) mapref: ElementRef;
  @Select() profile$: Observable<ProfileStateModel>;
  map: google.maps.Map;
  plan: WLPlan;

  constructor(private store: Store) {
  }


  ngOnInit(): void {
    this.map = new google.maps.Map(this.mapref.nativeElement, {zoom: 12, center: {lat: 46, lng: 21}});
  }

  follow() {
    this.store.dispatch(new WLProfileActions.Set.Followed(true));
  }

  unfollow() {
    this.store.dispatch(new WLProfileActions.Set.Followed(false));
  }

}
