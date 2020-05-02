import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { WLPlace, WLPLaceList } from '@wl-core/models/list-types';
import { WLPlan } from './plan.model';
import { PlanService } from './plan.service';
import { PlaceGroupComponent } from '@wl-shared/place-group/place-group.component';
import { PriceGroupComponent } from '@wl-shared/price-group/price-group.component';
import { TodoGroupComponent } from '@wl-shared/todo-group/todo-group.component';
import * as SnazzyInfoWindow from 'snazzy-info-window';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanComponent implements OnInit {
  @Input() editable: boolean = false;
  @Input() mapHeight: string = '500px';
  @Input() plan: WLPlan;
  @ViewChild('mapRef', {static: true}) mapRef: ElementRef;
  @ViewChild('infoWindowContent', {static: true}) infoWindowContent: ElementRef;
  @ViewChild('placeGroupC', {static: true}) placeGroup: PlaceGroupComponent;
  @ViewChild('priceGroupC', {static: true}) priceGroup: PriceGroupComponent;
  @ViewChild('todoGroupC', {static: true}) todoGroup: TodoGroupComponent;
  @ViewChild('cofferGroupC', {static: true}) cofferGroup: TodoGroupComponent;
  map: google.maps.Map;
  placesService: google.maps.places.PlacesService;
  marker: WLPlace = {infoWindow: null, marker: null, place: null};
  openedTab = 'places';

  constructor(public changeDetector: ChangeDetectorRef, private ps: PlanService) {

   }

  ngOnInit() {
    this.map = new google.maps.Map(this.mapRef.nativeElement, {zoom: 8, center: {lat: 46, lng: 24}});
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.marker.marker = new google.maps.Marker({map: this.map});
    this.marker.infoWindow = new SnazzyInfoWindow({
      marker: this.marker.marker,
      content: this.infoWindowContent.nativeElement,
      closeWhenOthersOpen: true,
      wrapperClass: 'info-window',
    });
    if(this.plan === undefined)
    this.plan = new WLPlan(
      this.ps,
      undefined,
      this.map,
      undefined,
      [],
      [],
      [],
    );

    this.map.addListener('click', (event: any) => {
      event.stop();
      if (event.placeId && this.editable) {
        this.placesService.getDetails(event, (place, status) => {
          if (status === 'OK') {
            this.marker.place = {
              id: place.id,
              address: place.formatted_address,
              loc: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
              name: place.name,
              rating: place.rating ? place.rating : null,
              website: place.website ? place.website : null
            };
            this.changeDetector.detectChanges();
            this.marker.marker.setPosition(place.geometry.location);
            this.marker.infoWindow.open();
          }
        });
      }
    });
  }

  addMarkerToGroup(group: WLPLaceList) {
    group.addPlace(this.marker.place);
    this.marker.infoWindow.close();
    this.marker.marker.setPosition(null);
    group.renderRoute(false);
    this.placeGroup.changeDetector.detectChanges();
    this.changeDetector.detectChanges();
  }

  trackby = (index: number, item) => item;

  save(form: FormGroup, id: string = null) {
    this.plan.title = form.value.title;
    this.plan.start = form.value.start;
    this.plan.end = form.value.end;
    if (form.value.isPublic !== null) {
      this.plan.isPublic = form.value.isPublic;
    }
    this.plan.save(id).then( result =>{
      this.placeGroup.placeGroups.forEach(() => this.placeGroup.deleteGroup(0));
      this.plan.placeGroups = this.placeGroup.placeGroups;
      this.priceGroup.priceGroups.forEach(() => this.priceGroup.deleteGroup(0));
      this.plan.priceGroups = this.priceGroup.priceGroups;
      this.todoGroup.todoGroups.forEach(() => this.todoGroup.deleteGroup(0));
      this.plan.todoGroups = this.todoGroup.todoGroups;
      this.cofferGroup.todoGroups.forEach(() => this.cofferGroup.deleteGroup(0));
      this.plan.cofferGroups = this.cofferGroup.todoGroups;
      this.marker.infoWindow.close();
      this.marker.marker.setPosition(null);
      this.marker.place = null;
      form.reset();
      form.setValue({title: 'New Plan', start: null, end: null, isPublic: false});
    });
  }

  loadPlan(uid: string, planId: string, isPublic: boolean = true) {
    this.plan.load(uid, planId, isPublic)
    .then(() => {
      this.changeDetector.detectChanges();
      this.priceGroup.total = 0;
      this.priceGroup.priceGroups.forEach(group => this.priceGroup.total += group.sum);
      this.cofferGroup.changeDetector.detectChanges();
      this.todoGroup.changeDetector.detectChanges();
      this.priceGroup.changeDetector.detectChanges();
    });
  }
}
