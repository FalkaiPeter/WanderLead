import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileStateModel } from '@wl-core/states/profile.state';
import { WLPlan } from '../plan/plan.model';
import { PlanService } from '../plan/plan.service';
import { PlanComponent } from '../plan/plan.component';
import { MatAccordion } from '@angular/material';


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

  constructor() {
  }


  ngOnInit(): void {
    this.map = new google.maps.Map(this.mapref.nativeElement, {zoom: 12, center: {lat: 46, lng: 21}});
  }

  follow() {}
  unfollow() {}

}
