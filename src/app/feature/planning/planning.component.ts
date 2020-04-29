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







@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanningComponent implements OnInit, AfterViewInit {
  @ViewChild(PlanComponent, {static: true}) plan: PlanComponent;
  @ViewChild('search', {static: true}) searchRef: ElementRef;


  autocomplete: google.maps.places.Autocomplete;

  planTitle = 'New Plan';

  metaDataFormGroup: FormGroup;
  metaDataMatcher = new WLErrorStateMatcher();

  constructor(private changeDetector: ChangeDetectorRef, private fb: FormBuilder, private ps: PlanService) {}


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
