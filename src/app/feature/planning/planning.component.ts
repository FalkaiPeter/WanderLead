import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, NgZone} from '@angular/core';
import { LocationList, TodoList, PriceList } from '@wl-shared/list-types';
import { MapsAPILoader, AgmMap, GoogleMapsAPIWrapper, AgmMarker } from '@agm/core';
import { FitBoundsService } from '@agm/core/services/fit-bounds';
import { BehaviorSubject, Observable, of } from 'rxjs';



@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanningComponent implements OnInit {
  @ViewChild('search', {static: false}) searchRef: ElementRef;
  locationGroups: LocationList[];
  todo: TodoList;
  coffer: TodoList;
  prices: PriceList;
  mapCenter$: BehaviorSubject<{
    lat: number;
    lng: number;
  }>;
  places: google.maps.places.PlacesService;




  @ViewChild('map', {static: true}) map: AgmMap;


  constructor(private apiLoader: MapsAPILoader, private ngZone: NgZone) {
  }

  async ngOnInit(): Promise<void> {
    this.mapCenter$ = new BehaviorSubject({lat: 46, lng: 21});
    await this.apiLoader.load();
    this.places = new google.maps.places.PlacesService(document.getElementById('map') as HTMLDivElement);
    const autocomplete = new google.maps.places.Autocomplete(this.searchRef.nativeElement);
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        if (autocomplete.getPlace().geometry === undefined) { return; }
        this.mapCenter$.next({lat: autocomplete.getPlace().geometry.location.lat(), lng: autocomplete.getPlace().geometry.location.lng()});
        this.map.triggerResize(true);
      });
    });
  }

  addMarker(event){
    if(event.placeId){
      this.places.getDetails(event.placeId, (place,status) => {
        console.log(place);
      })
    }
  }

}
