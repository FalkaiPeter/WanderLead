import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import * as SnazzyInfoWindow from 'snazzy-info-window';
import { WLPLaceList, WLPlace, WLPriceList } from '@wl-core/models/list-types';
import { PlaceGroupComponent } from '@wl-shared/place-group/place-group.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WLValidators, WLErrorStateMatcher } from '@wl-core/validators';
import { PriceGroupComponent } from '@wl-shared/price-group/price-group.component';
import { TodoGroupComponent } from '@wl-shared/todo-group/todo-group.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Select } from '@ngxs/store';
import { CurrentUserState } from '@wl-core/states/current-user.state';
import { Observable } from 'rxjs';
import { WlUser } from '@wl-core/models/user.model';
import { take, tap } from 'rxjs/operators';
import { PlanService } from '../plan/plan.service';
import { WLPlan } from '../plan/plan.model';
import { PlanComponent } from '../plan/plan.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { WLPlanTypes } from '../plan/plan-type';







@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanningComponent implements OnInit, AfterViewInit {
  @ViewChild(PlanComponent, {static: true}) plan: PlanComponent;
  @ViewChild('search', {static: true}) searchRef: ElementRef;
  mobile = window.outerWidth <= 425 ? true : false;
  routerData: {
    data: WLPlanTypes.DBmodel;
    isPublic: boolean;
    id: string;
  }


  autocomplete: google.maps.places.Autocomplete;

  planTitle = 'New Plan';

  metaDataFormGroup: FormGroup;
  metaDataMatcher = new WLErrorStateMatcher();

  constructor(private changeDetector: ChangeDetectorRef, private fb: FormBuilder, private ps: PlanService, private router: Router) {
    this.router.getCurrentNavigation().extras.state !== undefined
    ? this.routerData = {
        data: this.router.getCurrentNavigation().extras.state.data,
        isPublic: this.router.getCurrentNavigation().extras.state.isPublic,
        id: this.router.routerState.snapshot.url.split('/')[2]
      }
    : this.routerData = null;
  }


  ngOnInit() {
    this.metaDataFormGroup = this.fb.group({
      title: new FormControl('New Plan', WLValidators.name),
      start: null,
      end: null,
      isPublic: false,
    });
    this.metaDataFormGroup.valueChanges.subscribe(value => value.title === '' ? this.planTitle = 'New Plan' : this.planTitle = value.title);
    this.autocomplete = new google.maps.places.Autocomplete(this.searchRef.nativeElement);
  }

  ngAfterViewInit() {
    if(this.routerData) {
      this.plan.plan.loadFromDbModel(this.routerData.data, this.routerData.isPublic);
      this.metaDataFormGroup.setValue({title: this.plan.plan.title, start: this.plan.plan.start, end: this.plan.plan.end, isPublic: this.plan.plan.isPublic})
      this.plan.changeDetector.detectChanges();
      this.plan.priceGroup.total = 0;
      this.plan.priceGroup.priceGroups.forEach(group => this.plan.priceGroup.total += group.sum);
      this.plan.cofferGroup.changeDetector.detectChanges();
      this.plan.todoGroup.changeDetector.detectChanges();
      this.plan.priceGroup.changeDetector.detectChanges();
      this.changeDetector.detectChanges();
    }

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      this.plan.marker.infoWindow.close();
      this.plan.marker.marker.setPosition(null);
      if (!place.types.includes('locality')) {
        this.plan.marker.place = {
          id: place.id,
          address: place.formatted_address,
          loc: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
          name: place.name,
          rating: place.rating,
          website: place.website
        };
        this.plan.marker.marker.setPosition(place.geometry.location);
        this.plan.marker.infoWindow.open();
      }
      this.plan.map.panTo(place.geometry.location);
      this.plan.changeDetector.detectChanges();
    });
  }
}
