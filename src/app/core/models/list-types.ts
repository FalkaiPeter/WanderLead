import * as SnazzyInfoWindow from 'snazzy-info-window';
import { WLPlanTypes } from 'src/app/feature/plan/plan-type';

export abstract class WLGenericList<T> {
  private _items: T[];
  private _title: string;

  constructor(title: string, items?: T[]) {
    items ? this._items = items : this._items = [];
    this._title = title;
  }

  add(item: T) {
    this._items.push(item);
    return this._items;
  }
  remove(index: number) {
    return this._items = [
    ...this._items.slice(0, index),
    ...this._items.slice(index + 1),
    ];
  }
  getItem(index: number) {return this._items[index]; }
  setItem(index: number, value: T) { this._items[index] = value; }

  get title() { return this._title; }
  set title(title: string) { this._title = title; }

  get items() { return this._items; }
  set items(items: T[]) { this._items = items; }
}

export interface WLITodo {
  name: string;
  done: boolean;
}

export class WLTodoList extends WLGenericList<WLITodo> {
  constructor(title: string, items?: WLITodo[]) {
    super(title, items);
  }
  done(index: number) {
    const item = super.getItem(index);
    super.setItem(index, {name: item.name, done: !item.done});
  }

}

export interface WLIPice {
  name: string;
  price: number;
}

export class WLPriceList extends WLGenericList<WLIPice> {
  constructor(title: string, items?: WLIPice[]) {
    super(title, items);
    items ? items.forEach(item => this._sum += item.price) : this._sum = 0;
  }
  get sum() { return this._sum; }
  private _sum: number = 0;

  add(item: WLIPice) {
    this._sum += item.price;
    return super.add(item);
  }
  remove(index: number) {
    this._sum -= super.items[index].price;
    return super.remove(index);
  }

}

export interface WLPlace {
  place: WLPlanTypes.Place.Place;
  marker: google.maps.Marker;
  infoWindow: SnazzyInfoWindow;
}

export class WLPLaceList extends WLGenericList<WLPlace> {
  distanceService: google.maps.DistanceMatrixService;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  color: string;
  private _map: google.maps.Map;
  constructor(
    title: string,
    distanceService: google.maps.DistanceMatrixService,
    directionsRenderer: google.maps.DirectionsRenderer,
    directionsService: google.maps.DirectionsService,
    color: string = '#' + ('000000' + Math.floor(0x1000000 * Math.random()).toString(16)).slice(-6),
    items: WLPlace[] = [],
  ) {
    super(title, items);
    this.distanceService = distanceService;
    this.directionsRenderer = directionsRenderer;
    this.directionsService = directionsService;
    this.color = color;
    this._map = this.directionsRenderer === null ? null : this.directionsRenderer.getMap();
  }

  public icon(color: string = this.color) {
    return {
      path: `M1708 6384 c-830 -107 -1503 -725 -1668 -1534 -28 -138 -35 -215 -35
      -395 0 -178 6 -245 37 -385 45 -210 107 -358 281 -670 162 -292 184 -329 473
      -776 364 -563 503 -799 662 -1120 204 -413 356 -822 462 -1247 28 -109 50
      -207 50 -218 0 -36 17 -19 24 24 14 92 100 418 152 580 202 621 446 1101 972
      1912 363 560 430 670 575 961 159 318 216 487 244 719 10 88 10 359 0 445 -12
      107 -16 130 -48 260 -118 480 -453 926 -891 1184 -195 114 -451 207 -678 245
      -36 6 -81 13 -100 16 -77 13 -407 12 -512 -1z`,
      scale: 0.00655,
      fillOpacity: 1,
      fillColor: color,
      rotation: 180,
      scaledSize: new google.maps.Size(27, 43, 'pt', 'pt'),
      anchor: new google.maps.Point(1971.5, 0),
      labelOrigin: new google.maps.Point(2071.5, 3900)
    };
  }

  addPlace(place: WLPlanTypes.Place.Place) {
    const infoWindowContent =
   `<div style="padding:5px;">
      <div>
        <span style="display: block; margin: 5px 0; font-size: 16px; font-weight: 500; margin-bottom: 10px;"> ${place.name}</span>
        <span style="display: block; margin: 5px 0; ">Address: ${place.address}</span>
        ${place.rating ? `<span style="display: block; margin: 5px 0; ">Rating: ${place.rating}</span>` : '' }
        ${place.website ? `<span style="display: block; margin: 5px 0; "><a href="${place.website}">Website</a></span>` : '' }
      </div>
    </div>`;
    const marker = new google.maps.Marker({
      map: this._map,
      position: place.loc,
      icon: this.icon(),
      label: (this.items.length + 1).toString(),
    });
    const infoWindow = new SnazzyInfoWindow({
      marker,
      content: infoWindowContent,
      closeWhenOthersOpen: true,

    });
    super.add({place, infoWindow, marker});
    this.renderRoute();
  }

  remove(index: number) {
    super.items[index].marker.setMap(null);
    const items = super.remove(index);
    for (let i = 0; i < items.length; i++) {
      items[i].marker.setLabel((i + 1).toString());
    }
    this.renderRoute(false);
    return items;
  }

  public renderRoute(fullyOptimised: boolean = false) {
    this.directionsRenderer.setMap(null);
    if (this.items.length < 2) { return; }
    if (fullyOptimised) {
      /* TODO FULLI OPTIMISED ROUTE */
      return;
    } else {
      // tslint:disable-next-line: max-line-length
      const waypoints: google.maps.DirectionsWaypoint[] = this.items.slice(1, this.items.length - 1)
                                                          .map(item => ({location: new google.maps.LatLng(item.place.loc)}));
      this.directionsService.route({
        origin: this.items[0].place.loc,
        waypoints,
        optimizeWaypoints: true,
        destination: this.items[this.items.length - 1].place.loc,
        travelMode: google.maps.TravelMode.DRIVING,
      }, route => {
        this.directionsRenderer.setMap(this._map);
        this.directionsRenderer.setDirections(route);
      });
    }
  }

}
