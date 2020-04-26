import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import * as SnazzyInfoWindow from 'snazzy-info-window';
import { WLPLaceGroup, WLPlace, WLPriceList } from '@wl-shared/list-types';
import { PlaceGroupComponent } from '@wl-shared/place-group/place-group.component';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { WLValidators, WLErrorStateMatcher } from '@wl-core/validators';
import { AngularFirestore } from '@angular/fire/firestore';






@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanningComponent implements OnInit, AfterViewInit {
  @ViewChild('mapRef', {static: true}) mapRef: ElementRef;
  @ViewChild(PlaceGroupComponent, {static: true}) placeGroup: PlaceGroupComponent;
  @ViewChild('infoWindowContent', {static: true}) infoWindowContent: ElementRef;
  @ViewChild('search', {static: true}) searchRef: ElementRef;
  map: google.maps.Map;
  marker: WLPlace = {place: null, marker: null, infoWindow: null};
  placesService: google.maps.places.PlacesService;
  autocomplete: google.maps.places.Autocomplete;
  openedTab = 'places';
  planTitle = 'New Plan'

  metaDataFormGroup: FormGroup;
  metaDataMatcher = new WLErrorStateMatcher();

  priceList = [new WLPriceList('Price List', [{name: 'aaaaaaaaaaaaaaaaaaaaa', price: 10}, {name: 'AFDG?MDSFÉ:', price: 123456789}])];

  constructor(private changeDetector: ChangeDetectorRef, private fb: FormBuilder, private afs: AngularFirestore) {}


  ngOnInit() {
    this.metaDataFormGroup = this.fb.group({
      title: new FormControl('', WLValidators.name),
      start: null,
      end: null,
    });
    this.metaDataFormGroup.valueChanges.subscribe(value => value.title === '' ? this.planTitle = 'New Plan' : this.planTitle = value.title);

    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      center: {lat: 46, lng: 21.9},
      zoom: 12,
    });
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.autocomplete = new google.maps.places.Autocomplete(this.searchRef.nativeElement);
  }

  ngAfterViewInit() {
    this.marker.marker = new google.maps.Marker({map: this.map});
    this.marker.infoWindow = new SnazzyInfoWindow({
      marker: this.marker.marker,
      content: this.infoWindowContent.nativeElement,
      closeWhenOthersOpen: true,
      wrapperClass: 'info-window',
    });

    this.map.addListener('click', (event: any) => {
      event.stop();
      if (event.placeId) {
        this.placesService.getDetails(event, (place, status) => {
          if (status === 'OK') {
            this.marker.place = place;
            this.marker.marker.setPosition(place.geometry.location);
            this.changeDetector.detectChanges();
            this.marker.infoWindow.open();
          }
        });
      }
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      this.marker.infoWindow.close();
      this.marker.marker.setPosition(null);
      if (!place.types.includes('locality')) {
        this.marker.place = place;
        this.marker.marker.setPosition(place.geometry.location);
        this.marker.infoWindow.open();
        this.changeDetector.detectChanges();
      }
      this.map.panTo(place.geometry.location);
    });

  }

  addMarkerToGroup(group: WLPLaceGroup) {
    const infoWindowContent =
   `<div class="wrapper">
      <div>
        <span class="">${this.marker.place.name}</span>
        <span class="">Address: ${this.marker.place.formatted_address}</span>
        <span class="">Rating: ${this.marker.place.rating}</span>
      </div>
    </div>`;
    /* új markert és info window- kell az elemnek amit átdobunk a komponensnek, máskülönben csak referencia lesz */
    const marker = new google.maps.Marker({
      map: this.map,
      position: this.marker.place.geometry.location,
      /* ez az ikon trükkös dolog nagyon, scale nelkul be kell rakni eloszor megnezni a mereteket majd xre a szelesseg felet beirni.  */
      icon: {
        path: `M1708 6384 c-830 -107 -1503 -725 -1668 -1534 -28 -138 -35 -215 -35
        -395 0 -178 6 -245 37 -385 45 -210 107 -358 281 -670 162 -292 184 -329 473
        -776 364 -563 503 -799 662 -1120 204 -413 356 -822 462 -1247 28 -109 50
        -207 50 -218 0 -36 17 -19 24 24 14 92 100 418 152 580 202 621 446 1101 972
        1912 363 560 430 670 575 961 159 318 216 487 244 719 10 88 10 359 0 445 -12
        107 -16 130 -48 260 -118 480 -453 926 -891 1184 -195 114 -451 207 -678 245
        -36 6 -81 13 -100 16 -77 13 -407 12 -512 -1z`,
        scale: 0.00655,
        fillOpacity: 1,
        fillColor: group.color,
        rotation: 180,
        scaledSize: new google.maps.Size(27, 43, 'pt', 'pt'),
        anchor: new google.maps.Point(1971.5, 0),
        labelOrigin: new google.maps.Point(2071.5, 3900)
      },
      label: (group.items.length + 1).toString(),
    });
    const place = this.marker.place;
    const infoWindow = new SnazzyInfoWindow({
      marker,
      content: infoWindowContent,
      closeWhenOthersOpen: true,
      wrapperClass: 'info-window',
    });
    group.add({
      marker,
      place,
      infoWindow
    })
    this.marker.infoWindow.close();
    this.marker.marker.setPosition(null);
    group.renderRoute(false);
    this.placeGroup.changeDetector.detectChanges();
    this.changeDetector.detectChanges();
  }

  savePlan() {

  }
}
